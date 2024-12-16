#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let lines = readAllLines

type Pt = (int * int)

type Robot = { pt: Pt; velocity: Pt }

let parse str =
    let parsedStr = Regex.Match(str, "p=(\-?\d+),(\-?\d+) v=(\-?\d+),(\-?\d+)")

    { pt = (int parsedStr.Groups.[1].Value, int parsedStr.Groups.[2].Value)
      velocity = (int parsedStr.Groups.[3].Value, int parsedStr.Groups.[4].Value) }


let width, height =
    match lines.[0].Split(",") |> Array.map int with
    | [| w; h |] -> w, h
    | _ -> failwith "Invalid input format"

let mutable robots = lines |> Array.skip 1 |> Array.map parse

// printfn "%A %A" width height
// printfn "%A" robots


let printGrid (pts: Robot array) =
    seq {
        for y in 0 .. height - 1 do
            for x in 0 .. width - 1 do
                let exists = pts |> Array.exists (fun r -> r.pt = (x, y))
                if exists then yield "X" else yield "."

            yield "\n"
    }

let wrap a b =
    if a < 0 then a + b
    else if a < b then a
    else a % b


let step (r: Robot) =
    let step' ((x, y): Pt) ((dx, dy): Pt) =
        let newX = x + dx
        let newY = y + dy
        wrap newX width, wrap newY height

    { r with pt = step' r.pt r.velocity }

let notXMas (robots: Robot array) =
    let hWidth = (width - 1) / 2
    let hHeight = (height - 1) / 2

    let a = printGrid robots |> Seq.toArray

    let bS =
        (seq {
            for y in 0 .. height - 1 do
                let l = hWidth - y
                let r = hWidth + y

                for x in 0 .. width - 1 do
                    if x = l || x = r then yield "X" else yield "."

                yield "\n"
        })

    let b = bS |> Seq.toArray

    let p z =
        z |> Array.iter (fun z' -> printf "%s" z')

    let set = robots |> Array.map (fun r -> r.pt) |> Set.ofArray

    if set.Count = robots.Length then
        a |> p
        printfn ""
        false
    else
        true
// b |> p


let mutable i = 0

while notXMas robots do
    robots <- robots |> Array.map step
    i <- i + 1

printfn "%A" i
