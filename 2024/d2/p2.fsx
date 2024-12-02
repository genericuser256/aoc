#load "../utils/util.fs"

open System.IO
open System.Text.RegularExpressions
open utils
open System

let args = fsi.CommandLineArgs

let lines =
    File.ReadAllLines args.[1]
    |> Array.map (fun line -> Regex.Split(line, "\s+"))
    |> Array.map (fun words -> words |> Array.map (fun word -> Int32.Parse(word.Trim())))

let allDecreasing (arr: int[]) =
    arr |> Array.pairwise |> Array.forall (fun (p1, p2) -> p1 > p2)

let allIncreasing (arr: int[]) =
    arr |> Array.pairwise |> Array.forall (fun (p1, p2) -> p1 < p2)

let safeStep (arr: int[]) =
    arr
    |> Array.pairwise
    |> Array.map (fun (p1, p2) -> Math.Abs(p1 - p2))
    |> Array.forall (fun x -> x >= 1 && x <= 3)

let permute (arr: int[]) =
    [| for i in 0 .. arr.Length - 1 -> Array.removeAt i arr |]
    |> Array.append [| arr |]

let result =
    lines
    |> Array.map permute
    |> Array.filter (fun line ->
        line
        |> Array.exists (fun p -> (allDecreasing p || allIncreasing p) && safeStep p))
    |> Array.length

printfn "%d" result
