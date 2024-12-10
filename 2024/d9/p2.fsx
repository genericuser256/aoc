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

let evenIndexed, oddIndexed =
    data
    |> Seq.mapi (fun i x -> (i, x))
    |> Seq.toArray
    |> Array.partition (fun (i, _) -> i % 2 = 0)

// id, idx, size
let files = evenIndexed |> Array.mapi (fun i (idx, v) -> (i, idx, v))

// idx, size
let emptySpaces = oddIndexed


let rec combine (idx: int, realIdx: int, file: bool) =
    if file then
        let id, _, size = files.[idx]
        // combine (idx, false) |> List.append (List.replicate size id)
        files.[idx] <- (id, realIdx, size)
        combine (idx, realIdx + size, false)
    else if idx >= emptySpaces.Length then
        ()
    else
        let oldIdx, size = emptySpaces.[idx]
        emptySpaces.[idx] <- (realIdx, size)
        // combine (idx + 1, true) |> List.append (List.replicate size -1)
        combine (idx + 1, realIdx + size, true)


combine (0, 0, true)

// printfn "%A" files
// printfn "%A" emptySpaces

let printCombinedArray arr =
    printfn "%A" (String.Join("", arr |> Seq.map (fun x -> if x = -1 then "." else x.ToString()) |> Seq.toArray))

// printCombinedArray (
//     interleaveArrays (files |> Array.map (fun (id, _, _) -> id)) (emptySpaces |> Array.map (fun _ -> -1))
// )

// let finalFiles =

let findLeftMostSpace (size: int) =
    try
        emptySpaces |> Seq.findIndex (fun (idx, space) -> space >= size)
    with _ ->
        -1

let orderedFiles =
    files
    |> Seq.rev
    |> Seq.map (fun (id, fileIdx, size) ->
        let idx = findLeftMostSpace (size)

        if idx <> -1 then
            let (spaceIdx, space) = emptySpaces.[idx]
            emptySpaces.[idx] <- (spaceIdx + size, space - size)
            (spaceIdx, id, size)
        else
            (fileIdx, id, size))
    |> Seq.sortBy (fun (idx, _, _) -> idx)

let result =
    orderedFiles
    // |> peek (printfn "%A")
    |> Seq.map (fun (i, id, size) ->
        // printfn "\n%A %A %A" i id size

        seq {
            for x in i .. i + size - 1 do
                // printfn "%A %A %A" x id (x * id)
                (int64 x) * (int64 id)
        }
        |> Seq.sum)
    |> Seq.sum


printfn "%A" result

let high = 8800549860065L
printfn "%A" (result < high)
