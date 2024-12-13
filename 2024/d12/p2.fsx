#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap

let grid = readAllLinesAsGrid

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


let allDirs = [ Up; Right; Down; Left ]

type Pos = (int * int)

let at ((x, y): Pos) : string = grid.[y].[x]

let inBounds ((x, y): Pos) =
    y >= 0 && y < grid.Length && x >= 0 && x < grid.[0].Length

let step ((x, y): Pos) (dir: Dir) =
    let dx, dy = dir.toStep ()
    (x + dx, y + dy)


let area (s: Set<Pos>) = s.Count

let perimeter (s: Set<Pos>) =
    s
    // |> Seq.sort
    |> Seq.map (fun p -> allDirs |> Seq.filter (fun dir -> not (s.Contains(step p dir))) |> Seq.length)
    |> Seq.map (fun x -> if x = 1 then 0 else x)
    |> Seq.sum

let sidesOld (s: Set<Pos>) =
    let initial = s |> Seq.find (fun _ -> true)

    let getNext (p: Pos) (dir: Dir) =
        let side = dir.leftTurn ()

        if inBounds (step p dir) then
            let next = step p dir
            let diagonal = (step next side)

            if s.Contains diagonal then
                // printfn "turn"
                (diagonal, dir.leftTurn (), 1)
            else if s.Contains next then
                (next, dir, 0)
            else
                // printfn "turn"
                (p, dir.rightTurn (), 1)
        else
            // printfn "turn"
            (p, dir.rightTurn (), 1)

    let rec followEdge (pos: Pos) (dir: Dir) =
        let next, nextDir, sideCount = getNext pos dir
        // printfn "%A %A %A %A %A" pos dir next nextDir sideCount

        if next = initial && nextDir = Right then
            sideCount
        else
            sideCount + followEdge next nextDir

    // printfn "initial: %A" initial
    // We need to add 1 here to catch the initial side
    followEdge initial Right

let bounds (s: Set<Pos>) =
    let xs = s |> Set.map fst
    let ys = s |> Set.map snd
    xs |> Set.minElement, xs |> Set.maxElement, ys |> Set.minElement, ys |> Set.maxElement


let getSides (s: Set<Pos>) =
    let xs = s |> Set.map fst
    let ys = s |> Set.map snd
    let minX, maxX, minY, maxY = bounds s

    // printfn "%A" (s |> Seq.find (fun _ -> true) |> at)
    // printfn "%A %A %A %A" minX maxX minY maxY

    let rec castRayH (p: Pos) (out: bool) =
        let p' = step p Right
        let newOut = s.Contains p' |> not
        // printfn "h %A %A %A %A" p p' out newOut

        if fst p >= maxX then
            match out = newOut with
            | true -> Set.empty
            | false -> set [ ((p, p'), true) ]
        else
            match out = newOut with
            | true -> castRayH p' newOut
            | false -> (castRayH p' newOut).Add((p, p'), out)

    let rec castRayV (p: Pos) (out: bool) =
        let p' = step p Down
        let newOut = s.Contains p' |> not
        // printfn "v %A %A %A %A" p p' out newOut

        if snd p >= maxY then
            match out = newOut with
            | true -> Set.empty
            | false -> set [ ((p, p'), true) ]
        else
            match out = newOut with
            | true -> castRayV p' newOut
            | false -> (castRayV p' newOut).Add((p, p'), out)

    let verticalEdges =
        xs |> Set.map (fun x -> castRayV (x, minY - 1) true) |> Set.unionMany

    let horizontalEdges =
        ys |> Set.map (fun y -> castRayH (minX - 1, y) true) |> Set.unionMany

    let verticalSides =
        verticalEdges
        |> Set.filter (fun ((top, bottom), out) ->
            let top' = step top Left
            let bottom' = step bottom Left
            verticalEdges.Contains((top', bottom'), out) |> not)

    let horizontalSides =
        horizontalEdges
        |> Set.filter (fun ((left, right), out) ->
            let left' = step left Up
            let right' = step right Up
            horizontalEdges.Contains((left', right'), out) |> not)

    // printfn "v %A" verticalEdges
    // printfn "h %A" horizontalEdges
    // printfn "v %A" verticalSides
    // printfn "h %A" horizontalSides
    // printfn "c %A" (verticalSides.Count + horizontalSides.Count)

    verticalSides.Count + horizontalSides.Count

// printfn "AA\nA"
// printfn "%A" (getSides (set [ (0, 0); (0, 1); (1, 0) ]))

// printGridWithIndices grid

let mutable plots: (string * Set<Pos>) array = [||]

for y in 0 .. grid.Length - 1 do
    for x in 0 .. grid.[0].Length - 1 do
        let p: Pos = (x, y)
        let v = at p

        let potentials: Pos list =
            match p with
            | (0, 0) -> []
            | (0, _) -> [ step p Up ]
            | (_, 0) -> [ step p Left ]
            | _ -> [ step p Up; step p Left ]
            |> List.filter (fun p' -> (at p') = v)

        match potentials with
        | [] ->
            // printfn "no %s for pos %A" v p
            plots <- Array.append plots [| (v, set [ p ]) |]
        | [ a ] ->
            let idx = plots |> Array.findIndex (fun (v, s) -> s.Contains(a))
            // printfn "ya %s at idx %A for pos %A, with existing %A" v idx p (snd plots.[idx])
            plots.[idx] <- (v, (snd plots.[idx]).Add(p))
        | [ a; b ] ->
            let idxA = plots |> Array.findIndex (fun (v, s) -> s.Contains(a))
            let idxB = plots |> Array.findIndexBack (fun (v, s) -> s.Contains(b))

            if idxA = idxB then
                let idx = plots |> Array.findIndex (fun (v, s) -> s.Contains(a))
                // printfn "ya %s at shared idx %A for pos %A, with existing %A" v idx p (snd plots.[idx])
                plots.[idx] <- (v, (snd plots.[idx]).Add(p))
            else
                // printfn
                //     "ya %s at idx %A and %A for pos %A, with existing %A, %A"
                //     v
                //     idxA
                //     idxB
                //     p
                //     (snd plots.[idxA])
                //     (snd plots.[idxB])

                let sA = snd plots.[idxA]
                let sB = snd plots.[idxB]
                plots <- plots |> Array.removeAt idxA

                let idxB' = plots |> Array.findIndex (fun (v, s) -> s.Contains(b))
                plots <- plots |> Array.removeAt idxB'
                plots <- Array.append plots [| (v, sA.Add(p) |> Set.union sB) |]
        | _ -> raise (Exception("Unhandled case for potentials"))

// if plots |> Set.exists (fun (v', locs) -> v' = v && locs.Contains(p)) |> not then
//     plots <- plots.Add(findPlot p)

// printfn "%A" plots

// plots
// |> Seq.iter (fun plot -> printfn "%A: A: %A P: %A" (fst plot) (area (snd plot)) (perimeter (snd plot)))

let result = plots |> Seq.map (fun (v, s) -> getSides s * area s) |> Seq.sum

printfn "%A %A" result (result > 906608)
