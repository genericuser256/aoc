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


let add (a: Option<int>) b =
    match a with
    | Some(v) -> Some(v + b)
    | _ -> None

let min (a: Option<int>) (b: Option<int>) =
    match a, b with
    | Some(a), Some(b) -> Some(Math.Min(a, b))
    | Some(a), None -> Some(a)
    | None, Some(b) -> Some(b)
    | _ -> None

let mutable cache = Map.empty

let inCache key = cache.ContainsKey key

let addToCache key value =
    cache <- cache.Add(key, value)
    value

let getValue key = (cache.TryFind key).Value

let rec solveMaze pt (dir: Dir) (seen: Set<(Pt * Dir)>) (total: int) : int option =
    let newSeen = seen.Add(pt, dir)
    let key = (pt)

    if inCache key then
        let value = getValue key
        addToCache key (min value (Some total))
    elif pt = exit then
        printfn "exit %A" total
        addToCache key (Some total)
    elif walls.Contains pt || seen.Contains(pt, dir) then
        None
    else
        let pt' = step dir pt
        let s = solveMaze pt' dir newSeen (total + 1)

        let lDir = dir.leftTurn ()
        let lPt = step lDir pt
        let l = solveMaze pt lDir newSeen (total + 1000)

        let rDir = dir.rightTurn ()
        let rPt = step rDir pt
        let r = solveMaze pt rDir newSeen (total + 1000)

        printfn "%A %A %A %A" pt s l r
        let cost = min (min s l) r
        addToCache key cost

// let solve () =
//     let mutable ops = [(start, Right)]
//     let mutable costMap = Map.ofList [(start, 0)]

//     let addCost pt cost=
//         costMap.Add pt (
//             match costMap.TryFind pt with
//             | Some(value) -> min cost value
//             | _ -> cost)

//     while not ops.IsEmpty do
//         let (pt, dir) = ops.Head
//         ops <- ops.Tail
//         let cost = costMap.TryFind pt

//         let pt' = step dir pt
//         ops <- (pt', dir)
//         addCost pt'
//         let s = solveMaze pt' dir newSeen (add total 1)

//         let lDir = dir.leftTurn ()
//         let lPt = step lDir pt
//         let l = solveMaze lPt lDir newSeen (add total 1000)

//         let rDir = dir.rightTurn ()
//         let rPt = step rDir pt
//         let r = solveMaze rPt rDir newSeen (add total 1000)



solveMaze start Right (set []) 0
printfn "%A" (cache |> Map.toArray |> Array.filter (fun (pt, _) -> pt = exit))
