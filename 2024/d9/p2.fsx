#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

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


// printfn "%A" files
// printfn "%A" emptySpaces

combine (0, 0, true)

// printfn "%A" files
// printfn "%A" emptySpaces

let diskMap =
    interleaveArrays
        (files |> Array.map (fun (id, _, size) -> Array.replicate size (string id)))
        (emptySpaces |> Array.map (fun (_, size) -> Array.replicate size "."))
    |> Array.concat

// printfn "%A" (String.Join("", (diskMap)))


// let finalFiles =

let findLeftMostSpace (size: int) =
    try
        emptySpaces |> Seq.findIndex (fun (_, space) -> space >= size)
    with _ ->
        -1

// printfn "%A" (String.Join("", (diskMap)))

let orderedFiles =
    files
    |> Seq.rev
    |> Seq.map (fun (id, fileIdx, size) ->
        let idx = findLeftMostSpace (size)

        if idx <> -1 then
            let (spaceIdx, space) = emptySpaces.[idx]

            if fileIdx > spaceIdx then
                // printfn "ya %A %A %A %A" fileIdx id size spaceIdx
                emptySpaces.[idx] <- (spaceIdx + size, space - size)

                for i in 0 .. size - 1 do
                    diskMap.[spaceIdx + i] <- string id

                (spaceIdx, id, size)
            else
                (fileIdx, id, size)

        else
            // printfn "no %A %A %A" fileIdx id size

            for i in 0 .. size - 1 do
                diskMap.[fileIdx + i] <- string id

            (fileIdx, id, size))
    |> Seq.sortBy (fun (idx, _, _) -> idx)
    |> Seq.toArray


// printfn "%A" orderedFiles
// printfn "%A" (String.Join("", (diskMap)))
// orderedFiles |> Array.map (fun (_, id, size) -> String.replicate size (string id)) |> int |> Array.iter (fun x -> printfn "%A" x)

let result =
    orderedFiles
    // |> peek (printfn "%A")
    |> Seq.map (fun (idx, id, size) ->
        // printfn "\n%A %A %A" idx id size

        seq {
            for x in idx .. idx + size - 1 do
                // printfn "%A %A %A" x id (x * id)
                (int64 x) * (int64 id)
        }
        |> Seq.sum)
    |> Seq.sum


printfn "%A" result

let high = 8800549860065L
printfn "%A" (result < high)
