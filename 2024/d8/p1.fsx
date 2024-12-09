#load "../utils/util.fs"
#load "../utils/multimap.fs"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs

let lines =
    args.[1] |> File.ReadAllLines |> Array.map (fun line -> line.ToCharArray())

type Pos = (int * int)
type Grid = char array array

type Dir =
    | Right
    | DLeft
    | DRight
    | Down
    | Left
    | ULeft
    | URight
    | Up

let getOppositeDir (dir: Dir) =
    match dir with
    | Right -> Left
    | DLeft -> URight
    | DRight -> ULeft
    | Down -> Up
    | Left -> Right
    | ULeft -> DRight
    | URight -> DLeft
    | Up -> Down

let outOfBounds ((x, y): Pos, grid: Grid) =
    not (x >= 0 && x < grid.[0].Length && y >= 0 && y < grid.Length)

let step' ((x, y): Pos, dir: Dir, size: int) =
    match dir with
    | Right -> (x + size, y)
    | DLeft -> (x - size, y + size)
    | DRight -> (x + size, y + size)
    | Down -> (x, y + size)
    | Left -> (x - size, y)
    | ULeft -> (x - size, y - size)
    | URight -> (x + size, y - size)
    | Up -> (x, y - size)

let step (pos: Pos, dir: Dir) = step' (pos, dir, 1)

let rec countDistanceToSameNode ((x, y): Pos, c: char, dir: Dir, grid: Grid) =
    if outOfBounds ((x, y), grid) then
        None
    else if grid.[y].[x] = c then
        Some(1)
    else
        match countDistanceToSameNode ((step ((x, y), dir)), c, dir, grid) with
        | Some(value) -> Some(1 + value)
        | None -> None


let genAntiNodes ((x, y): Pos, grid: Grid) =
    [| Right; DLeft; DRight; Down |]
    |> Seq.map (fun dir -> (countDistanceToSameNode (step ((x, y), dir), grid.[y].[x], dir, grid), dir))
    // |> Seq.map (fun v ->
    //     printfn "%A %A %A" v y x
    //     v)
    |> Seq.map (fun (dist, dir) ->
        match dist with
        | None -> None
        | Some(value) -> Some(step' ((x, y), dir, value * 3), step' ((x, y), getOppositeDir (dir), value * 2)))
    |> Seq.choose id
    |> Seq.collect (fun (a, b) ->
        seq {
            a
            b
        })
    |> Set.ofSeq


let nodes =
    lines
    |> Seq.mapi (fun y line ->
        line
        |> Seq.mapi (fun x c ->
            match c with
            | '.' -> None
            | _ -> Some(x, y))
        |> Seq.choose id)
    |> Seq.collect id
    |> Set.ofSeq

// let result = genAntiNodes ((8, 1), lines)
let result =
    nodes
    |> Seq.map (fun pos -> genAntiNodes (pos, lines))
    |> Seq.collect id
    |> Seq.filter (fun pos -> not (outOfBounds (pos, lines) || nodes.Contains(pos)))
    |> Set.ofSeq

let z = genAntiNodes ((8, 1), lines)

let printGridWithLabels (grid: Grid, markedPositions: Set<Pos>) =
    printf "  "

    for x in 0 .. grid.[0].Length - 1 do
        printf " %d " (x % 10)

    printfn ""

    for y in 0 .. grid.Length - 1 do
        printf "%d " (y % 10)

        for x in 0 .. grid.[y].Length - 1 do
            if markedPositions.Contains((x, y)) then
                printf " # "
            else
                printf " %c " grid.[y].[x]

        printfn ""

printGridWithLabels (lines, result)
printfn "%A" result.Count
