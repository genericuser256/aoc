#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs

let lines =
    (File.ReadAllText args.[1]).Split("\n\n")
    |> Array.map (fun section -> section.Split("\n"))

let orderingRules =
    lines.[0]
    |> Array.map (fun line -> line.Split("|"))
    |> Array.map (fun line -> (int line.[0], int line.[1]))
    |> groupByFirstItem

let isWellOrdered (arr: int[]) =
    // printfn "\nchecking: %A" arr

    let reversed = Array.rev (arr)

    let z =
        reversed
        |> Array.mapi (fun i x ->
            // printfn "checking: %d %b" x (hasKey orderingRules x)

            if i = arr.Length - 1 then
                true
            else if hasKey orderingRules x then
                // let a =
                //     Array.skip (i + 1) reversed
                //     |> Array.map (fun y -> keyHasValue orderingRules x y)

                // printfn "a: %A %b" a (Array.exists id a)

                Array.skip (i + 1) reversed
                |> Array.exists (fun y -> keyHasValue orderingRules x y)
                |> not
            else
                true)

    // printfn "z: %A" z
    z |> Array.forall id


let updates =
    lines.[1]
    |> Array.filter (fun line -> line.Length > 0)
    |> Array.map (fun line -> line.Split(",") |> Array.map int)

let result =
    updates
    |> Array.filter (fun line -> isWellOrdered line)
    |> Array.map (fun line -> line.[(line.Length - 1) / 2])
    |> Array.sum

printfn "%A" result
