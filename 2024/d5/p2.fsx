#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Collections.Generic
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs

let lines =
    (File.ReadAllText args.[1]).Split("\n\n")
    |> Array.map (fun section -> section.Split("\n"))

let rules =
    lines.[0]
    |> Array.map (fun line -> line.Split("|"))
    |> Array.map (fun line -> (int line.[0], int line.[1]))

let orderingRules = rules |> groupByFirstItem
let orderingRulesRev = rules |> groupBySecondItem
let rulesWithFollower = orderingRules.Keys |> Set.ofSeq
let rulesWithLeader = orderingRules.Values |> Seq.concat |> Set.ofSeq

let rulesWithOrdering =
    orderingRules.Values |> Seq.concat |> Seq.append orderingRules.Keys |> Set.ofSeq

let updates =
    lines.[1]
    |> Array.filter (fun line -> line.Length > 0)
    |> Array.map (fun line -> line.Split(",") |> Array.map int)


let isWellOrdered (arr: int[]) =
    let reversed = Array.rev (arr)

    reversed
    |> Array.mapi (fun i x ->
        if i = arr.Length - 1 then
            true
        else if hasKey orderingRules x then
            Array.skip (i + 1) reversed
            |> Array.exists (fun y -> keyHasValue orderingRules x y)
            |> not
        else
            true)
    |> Array.forall id


let sort (arr: int[]) =

    let mutable graph =
        arr
        |> Array.map (fun x ->
            (x,
             getValues orderingRulesRev x
             |> Seq.filter (fun y -> arr |> Array.contains y)
             |> Set.ofSeq))
        |> Map.ofArray

    let mutable rulesWithoutDeps =
        graph |> Map.filter (fun key value -> value.IsEmpty) |> Map.keys |> Set.ofSeq

    let mutable orderedArr: int list = []

    // printfn "%A %A %A" arr s graph

    while not rulesWithoutDeps.IsEmpty do
        let currentRule = Set.minElement rulesWithoutDeps
        rulesWithoutDeps <- rulesWithoutDeps.Remove(currentRule)
        orderedArr <- currentRule :: orderedArr

        // printfn "%A %A" s el

        graph <-
            graph
            |> Map.map (fun key value ->
                let newValues =
                    if key <> currentRule then
                        value.Remove currentRule
                    else
                        value
                // printfn "%A %A %A" (key <> el) value newValues

                if key <> currentRule && newValues.IsEmpty && value.Contains currentRule then
                    rulesWithoutDeps <- rulesWithoutDeps.Add(key)

                newValues)

    // printfn "%A" graph

    if graph |> Map.exists (fun _ value -> not value.IsEmpty) then
        printfn "bad"

    orderedArr


let result =
    updates
    |> Array.filter (fun line -> isWellOrdered line |> not)
    |> Array.map (fun line -> sort line)
    |> Array.map (fun line -> line.[(line.Length - 1) / 2])
    |> Array.sum

printfn "%A" result
