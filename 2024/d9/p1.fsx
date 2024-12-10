#load "../utils/util.fs"
#load "../utils/multimap.fs"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs

let lines = args.[1] |> File.ReadAllLines
let data = lines.[0].ToCharArray() |> Seq.map string |> Seq.map int |> Array.ofSeq

// let evenIndexed, oddIndexed =
//     data
//     |> Seq.mapi (fun i x -> (i, x))
//     |> Seq.toArray
//     |> Array.partition (fun (i, _) -> i % 2 = 0)

// let files = evenIndexed |> Array.mapi (fun i (_, v) -> (i, v))
// let emptySpaces = oddIndexed |> Array.map snd

// let expanded =
//     files |> Array.take (emptySpaces.Length - 1) |> Array.allPairs emptySpaces

let t = List.replicate 1 "."

let expanded =
    data
    |> Array.indexed
    |> Array.fold
        (fun (file, lst) (i, x) ->
            if file then
                (false, (List.replicate x (string (i / 2)) |> List.append lst))
            else
                (true, (List.replicate x ".") |> List.append lst))
        (true, [])
    |> snd
    |> List.map (fun (x) -> x.ToString())
    |> List.toArray
// |> String.concat ""
// |> fun s -> s.ToCharArray()

// printfn "%s" (String.concat "" (expanded |> Seq.map snd))

let mutable back = expanded.Length - 1

try
    for (i, x) in (expanded |> Array.indexed) do
        if i >= back then
            raise (Exception("done"))
        else if x = "." then
            while expanded.[back] = "." do
                back <- back - 1

            if i < back then
                // printfn "%A %A %A %A" i x back expanded.[back]
                expanded.[i] <- expanded.[back]
                expanded.[back] <- "."
with _ ->
    ()

// printfn "%A %A %A %A %A" (back - 2) (back - 1) (back) (back + 1) (back + 2)
// printfn "%A %A %A %A %A" expanded.[back - 2] expanded.[back - 1] expanded.[back] expanded.[back + 1] expanded.[back + 2]
// printfn "%s" (String.concat "" (expanded |> Seq.map snd))


let result =
    (expanded
     |> Seq.takeWhile (fun c -> c <> ".")
     |> Seq.map int
     |> Seq.mapi (fun i x -> (int64 i) * (int64 x))
     |> Seq.sum)

printfn "%A" result


let low = 6518886897209L
printfn "%A" (result > low)
