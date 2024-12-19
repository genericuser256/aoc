#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap

type Pt = (int * int)

type Dir =
    | Up
    | Right
    | Down
    | Left

    member this.toStep() =
        match this with
        | Up -> (0, -1)
        | Right -> (1, 0)
        | Down -> (0, 1)
        | Left -> (-1, 0)

    member this.opposite() =
        match this with
        | Up -> Down
        | Right -> Left
        | Down -> Up
        | Left -> Right

    member this.rightTurn() =
        match this with
        | Up -> Right
        | Right -> Down
        | Down -> Left
        | Left -> Up

    member this.leftTurn() =
        match this with
        | Up -> Left
        | Right -> Up
        | Down -> Right
        | Left -> Down


let parse =
    let lines = readAllLinesAsGrid
    let mutable walls = []
    let mutable start = (0, 0)
    let mutable exit = (0, 0)

    for y in 0 .. lines.Length - 1 do
        for x in 0 .. lines.[0].Length - 1 do
            match lines.[y].[x] with
            | "#" -> walls <- (x, y) :: walls
            | "S" -> start <- (x, y)
            | "E" -> exit <- (x, y)
            | _ -> ()

    (walls |> Set.ofList), start, exit

let mutable walls, start, exit = parse

// printfn "%A %A %A" walls start exit

let width = walls |> Seq.map fst |> Seq.max
let height = walls |> Seq.map snd |> Seq.max

let step (dir: Dir) (x, y) =
    let dx, dy = dir.toStep ()
    x + dx, y + dy

let getDir (x, y) (x', y') =
    match (x - x', y - y') with
    | (1, 0) -> Left
    | (-1, 0) -> Right
    | (0, 1) -> Up
    | (0, -1) -> Down
    | _ ->
        printfn "%A %A" (x, y) (x', y')
        raise (Exception("bad state"))

let inBounds (x, y) =
    x >= 0 && x <= width && y >= 0 && y <= height

let reconstructPath (cameFrom: Map<Pt, Pt>) start =
    let mutable totalPath = [ start ]
    let mutable pt = start

    while cameFrom.ContainsKey pt do
        pt <- cameFrom[pt]
        totalPath <- pt :: totalPath

    totalPath

let d a b = if a = b then 1 else 1000

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
let aStar start h =
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let mutable openSet = set [ (start, Right) ]
    let addToOpen pt = openSet <- openSet.Add pt

    let removeFromOpen pt =
        openSet <- openSet |> Seq.find (fun (pt', _) -> pt = pt') |> openSet.Remove

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
    // to n currently known.
    let mutable cameFrom = Map.empty

    let getCameFrom pt = cameFrom.TryFind pt

    let setCameFrom pt v = cameFrom <- cameFrom.Add(pt, v)

    // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
    let mutable gScore = Map.empty

    let getGScore pt =
        match gScore.TryFind pt with
        | Some(value) -> value
        | _ -> Int32.MaxValue

    let setGScore pt v = gScore <- gScore.Add(pt, v)

    setGScore start 0

    // For node n, fScore[n] = gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how cheap a path could be from start to finish if it goes through n.
    let mutable fScore = Map.empty

    let getFScore pt =
        match fScore.TryFind pt with
        | Some(value) -> value
        | _ -> Int32.MaxValue

    let setFScore pt v = fScore <- fScore.Add(pt, v)
    setFScore start (h start)

    let mutable result = None

    while not openSet.IsEmpty && result.IsNone do
        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        let getCurrent () =
            openSet |> Seq.minBy (fun (pt, _) -> getFScore pt)

        let (current, currentDir) = getCurrent ()

        if current = exit then
            result <- Some(reconstructPath cameFrom current)
        else
            removeFromOpen current

            [ currentDir; currentDir.leftTurn (); currentDir.rightTurn () ]
            |> Seq.map (fun dir -> (step dir current, dir))
            |> Seq.filter (fun (pt, _) -> inBounds pt)
            |> Seq.filter (fun (pt, _) -> walls.Contains pt |> not)
            |> Seq.iter (fun (neighbour, dir) ->
                // d(current,neighbour) is the weight of the edge from current to neighbour
                // tentative_gScore is the distance from start to the neighbour through current
                let tGScore = (getGScore current) + (d currentDir dir)

                if tGScore < (getGScore neighbour) then
                    // This path to neighbour is better than any previous one. Record it!
                    setCameFrom neighbour current
                    setGScore neighbour tGScore
                    setFScore neighbour (tGScore + h (neighbour))
                    addToOpen (neighbour, dir))

    // Open set is empty but goal was never reached
    if result.IsSome then
        result.Value
    else
        raise (Exception("failed"))


let scorePath (path: Pt list) =
    let rec scorePath' pt dir path =
        match path with
        | [] -> 0
        | head :: tail ->
            (if head = (step dir pt) then 1 else 1001)
            + (scorePath' head (getDir pt head) tail)

    scorePath' path.Head Right path.Tail

let path = (aStar start (fun p -> 1))
// printfn "%A" path
printfn "%A" (scorePath path)
