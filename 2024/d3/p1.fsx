#load "../utils/util.fs"

open System.IO
open System.Text.RegularExpressions
open utils
open System

let args = fsi.CommandLineArgs

let lines =
    File.ReadAllLines args.[1]
    |> Array.map (fun line -> Regex.Matches(line, "mul\((\d+),(\d+)\)"))
    |> Array.map (fun matches -> matches |> Seq.cast<Match> |> Array.ofSeq)

// lines
// |> Array.iter (fun matches -> matches |> Array.iter (fun m -> printfn "Match: %A Groups: %A" m m.Groups))

let result =
    lines
    |> Array.map (fun matches ->
        matches
        |> Array.map (fun m -> (Int32.Parse(m.Groups.[1].Value), Int32.Parse(m.Groups.[2].Value))))
    |> Array.map (fun line -> line |> Array.map (fun (a, b) -> a * b) |> Array.sum)
    |> Array.sum

printfn "%d" result
