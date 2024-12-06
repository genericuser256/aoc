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

let rec causesLoop (loc: Loc, direction: Direction, stuffLocs: Set<Loc>, seen: Set<(Direction * Loc)>) =
    let nextLoc = getNextLoc (loc, direction)

    if outOfBounds (nextLoc) then
        false
    else if seen.Contains(direction, loc) then
        true
    else if stuffLocs.Contains(nextLoc) then
        causesLoop (loc, getNextDirection (direction), stuffLocs, seen.Add(direction, loc))
    else
        causesLoop (nextLoc, direction, stuffLocs, seen.Add(direction, loc))

let rec findLoops (initialLoc: Loc, initialDirection: Direction) =
    let mutable loc = initialLoc
    let mutable dir = initialDirection
    let mutable seen: Set<(Direction * Loc)> = Set.empty
    let mutable loopLocations: Set<Loc> = Set.empty
    let mutable run = true

    while run do
        let nextLoc = getNextLoc (loc, dir)
        let nextDir = getNextDirection (dir)

        if causesLoop (loc, nextDir, stuffLocs.Add(nextLoc), seen) then
            loopLocations <- loopLocations.Add(nextLoc)

        if outOfBounds (nextLoc) then
            run <- false
        else if stuffLocs.Contains(nextLoc) then
            dir <- nextDir
            seen <- seen.Add(dir, loc)
        else
            seen <- seen.Add(dir, loc)

            loc <- nextLoc

    // printfn "%A" paths
    loopLocations.Count

let result = findLoops (guardLoc, Up)

// printfn "%A" paths
printfn "%A" result
