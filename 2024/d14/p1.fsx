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

let robots = lines |> Array.skip 1 |> Array.map parse

let count = 100

// printfn "%A %A" width height
// printfn "%A" robots


let printGrid (pts: Pt array) =
    for y in 0 .. height - 1 do
        for x in 0 .. width - 1 do
            let len = pts |> Array.filter (fun pt -> pt = (x, y)) |> Array.length
            if len = 0 then printf "." else printf "%A" len

        printfn ""

let wrap a b =
    if a < 0 then a + b
    else if a < b then a
    else a % b

let step ((x, y): Pt) ((dx, dy): Pt) =
    let newX = x + dx
    let newY = y + dy
    wrap newX width, wrap newY height


let runThrough (r: Robot) =
    let mutable pt = r.pt

    for i in 1..count do
        // printfn ""
        // printGrid [| pt |]
        pt <- step pt r.velocity

    // printfn ""
    // printGrid [| pt |]

    pt

type Quad =
    | TL
    | TR
    | BL
    | BR

let getQuad ((x, y): Pt) =
    if x < width / 2 && y < height / 2 then Some(TL)
    else if x < width / 2 && y > height / 2 then Some(BL)
    else if x > width / 2 && y < height / 2 then Some(TR)
    else if x > width / 2 && y > height / 2 then Some(BR)
    else None


// runThrough robots.[10]


robots
|> Seq.map runThrough
// |> Seq.toArray
|> Seq.choose getQuad
|> countOccurrences
|> Map.toSeq
|> Seq.map snd
|> Seq.reduce (fun a b -> a * b)
|> printfn "%A"
