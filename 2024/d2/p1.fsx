﻿#load "../utils/util.fsx"

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

let result =
    lines
    |> Array.filter (fun line -> (allDecreasing line || allIncreasing line) && safeStep line)
    |> Array.length

printfn "%d" result
