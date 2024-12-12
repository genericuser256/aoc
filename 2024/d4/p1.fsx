#load "../utils/util.fsx"

open System.IO
open System.Text.RegularExpressions
open utils
open System

let args = fsi.CommandLineArgs

let lines =
    File.ReadAllLines args.[1]
    |> Array.map (fun line -> line.ToCharArray() |> Array.map (fun c -> c.ToString()))

let check (arr: string[]) =
    String.Join("", arr).Equals("XMAS") || String.Join("", arr).Equals("SAMX")

let horizontalTest (data: string[][], x: int, y: int) =
    try
        [| for i in 0..3 -> data.[y].[x + i] |]
        |> check
        |> fun x -> if x then 1 else 0
    with _ ->
        0

let verticalTest (data: string[][], x: int, y: int) =
    try
        [| for i in 0..3 -> data.[y + i].[x] |]
        |> check
        |> fun x -> if x then 1 else 0
    with _ ->
        0

let diagonalTest1 (data: string[][], x: int, y: int) =
    try
        [| for i in 0..3 -> data.[y + i].[x + i] |]
        |> check
        |> fun x -> if x then 1 else 0
    with _ ->
        0

let diagonalTest2 (data: string[][], x: int, y: int) =
    try
        [| for i in 0..3 -> data.[y + i].[x - i] |]
        |> check
        |> fun x -> if x then 1 else 0
    with _ ->
        0

// lines
// |> Array.iter (fun matches -> matches |> Array.iter (fun m -> printfn "Match: %A Groups: %A" m m.Groups))

let result =
    lines
    |> Array.mapi (fun y line ->
        line
        |> Array.mapi (fun x _ ->
            horizontalTest (lines, x, y)
            + verticalTest (lines, x, y)
            + diagonalTest1 (lines, x, y)
            + diagonalTest2 (lines, x, y))
        |> Array.sum)
    |> Array.sum

printfn "%d" result
