#load "../utils/util.fs"
#load "../utils/multimap.fs"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs


type Direction =
    | Up
    | Down
    | Left
    | Right

type Loc = (int * int)

let lines =
    args.[1] |> File.ReadAllLines |> Array.map (fun line -> line.ToCharArray())

let bounds = (lines.[0].Length, lines.Length)

let guardLoc: Loc =
    lines
    |> Seq.indexed
    |> Seq.pick (fun (y, line) ->
        line
        |> Seq.indexed
        |> Seq.tryPick (fun (x, c) -> if c = '^' then Some(x, y) else None))

let stuffLocs =
    lines
    |> Seq.indexed
    |> Seq.collect (fun (y, line) ->
        line
        |> Seq.indexed
        |> Seq.choose (fun (x, c) -> if c = '#' then Some(x, y) else None))
    |> Set.ofSeq

let getNextLoc (loc: Loc, direction: Direction) =
    match direction with
    | Up -> (fst loc, snd loc - 1)
    | Down -> (fst loc, snd loc + 1)
    | Left -> (fst loc - 1, snd loc)
    | Right -> (fst loc + 1, snd loc)

let getNextDirection (direction: Direction) =
    match direction with
    | Up -> Right
    | Right -> Down
    | Down -> Left
    | Left -> Up

let outOfBounds (loc: Loc) =
    fst loc < 0 || fst loc >= fst bounds || snd loc < 0 || snd loc >= snd bounds

let rec step (loc: Loc, direction: Direction) =
    let nextLoc = getNextLoc (loc, direction)

    if stuffLocs.Contains(nextLoc) then
        step (loc, getNextDirection (direction))
    else if outOfBounds (nextLoc) then
        [ loc ]
    else
        loc :: step (nextLoc, direction)


let result = step (guardLoc, Up) |> Set.ofList

printfn "%A" result.Count
