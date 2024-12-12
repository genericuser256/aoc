#load "../utils/util.fsx"

open System.IO
open System.Text.RegularExpressions
open utils
open System

let args = fsi.CommandLineArgs

let data =
    File.ReadAllLines args.[1]
    |> Array.map (fun line -> Regex.Matches(line, "mul\((\d+),(\d+)\)|do\(\)|don't\(\)"))
    |> Array.map (fun matches -> matches |> Seq.cast<Match> |> Array.ofSeq)
    |> Array.concat

// lines
// |> Array.iter (fun matches -> matches |> Array.iter (fun m -> printfn "Match: %A Groups: %A" m m.Groups))

let result =
    data
    |> Array.fold
        (fun (op, value) curr ->
            match curr.Groups.[0].Value with
            | "do()" -> (true, value)
            | "don't()" -> (false, value)
            | _ ->
                // printfn "Match: %A Groups: %A" curr curr.Groups
                let a = Int32.Parse(curr.Groups.[1].Value)
                let b = Int32.Parse(curr.Groups.[2].Value)

                (if op then (true, value + a * b) else (false, value)))
        (true, 0)

printfn "%d" (snd result)
