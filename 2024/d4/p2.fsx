#load "../utils/util.fs"

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

let test (data: string[][], x: int, y: int) =
    try
        let arr =
            [| data.[y - 1].[x - 1], data.[y - 1].[x + 1], data.[y + 1].[x - 1], data.[y + 1].[x + 1] |]

        if
            data.[y].[x] = "A"
            && (arr = [| "M", "M", "S", "S" |]
                || arr = [| "S", "S", "M", "M" |]
                || arr = [| "M", "S", "M", "S" |]
                || arr = [| "S", "M", "S", "M" |])
        then
            // printfn "%d %d" x y
            true
        else
            false
    with _ ->
        false

// lines
// |> Array.iter (fun matches -> matches |> Array.iter (fun m -> printfn "Match: %A Groups: %A" m m.Groups))

let result =
    lines
    |> Array.mapi (fun y line -> line |> Array.mapi (fun x _ -> if test (lines, x, y) then 1 else 0) |> Array.sum)
    |> Array.sum

printfn "%d" result
