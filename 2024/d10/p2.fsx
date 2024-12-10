#load "../utils/util.fs"
#load "../utils/multimap.fs"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs

let lines =
    args.[1]
    |> File.ReadAllLines
    |> Array.map (fun line -> line |> Seq.map string |> Seq.map int |> Seq.toArray)

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

type Pos = (int * int)

let at ((x, y): Pos) = lines.[y].[x]

let inBounds ((x, y): Pos) =
    y >= 0 && y < lines.Length && x >= 0 && x < lines.[0].Length

let step ((x, y): Pos, dir: Dir) =
    let dx, dy = dir.toStep ()
    (x + dx, y + dy)

let rec followPaths (pos: Pos) =
    let h = at (pos)
    // printfn "%A %A" h pos

    if h = 9 then
        1
    else
        [ Up; Right; Down; Left ]
        |> List.map (fun dir -> step (pos, dir))
        |> List.filter (fun pos' -> inBounds (pos') && (at (pos') - h) = 1)
        |> List.map (fun pos' -> followPaths (pos'))
        |> List.sum

let result =
    lines
    |> Array.mapi (fun y line ->
        line
        |> Array.mapi (fun x h -> if h = 0 then followPaths ((x, y)) else 0)
        |> Seq.sum)
    |> Seq.sum
// |> Set.ofList

printfn "%A" result
