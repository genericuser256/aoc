#load "../utils/util.fsx"

open System.IO
open System.Text.RegularExpressions
open utils
open System



let args = fsi.CommandLineArgs

let lines =
    File.ReadAllLines args.[1]
    |> Array.map (fun line -> Regex.Split(line, "\s+"))
    |> Array.map (fun words -> words |> Array.map (fun word -> Int32.Parse(word.Trim())))

let lhs = lines |> Array.map (fun arr -> arr.[0]) |> Array.sort
let rhs = lines |> Array.map (fun arr -> arr.[1]) |> Array.sort

// printfn "%A" lhs
// printfn "%A" rhs

let rhsCount = countOccurrences rhs

let result =
    lhs
    |> Array.map (fun x ->
        match rhsCount.TryFind x with
        | Some count -> count * x
        | None -> 0)
    |> Array.sum

printfn "%d" result
