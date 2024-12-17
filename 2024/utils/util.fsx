module utils

open System.IO

let peek action source =
    source
    |> Seq.map (fun x ->
        action x
        x)

let splitStringToArray (input: string) = input |> Seq.map string |> Seq.toArray

let interleaveArrays (arr1: 'a[]) (arr2: 'a[]) : 'a[] =
    let minLength = min (Array.length arr1) (Array.length arr2)

    let interleavedPart =
        [ for i in 0 .. minLength - 1 do
              yield arr1.[i]
              yield arr2.[i] ]

    let remainingPart =
        if Array.length arr1 > minLength then
            arr1.[minLength..]
        else
            arr2.[minLength..]

    Seq.append interleavedPart remainingPart |> Seq.toArray


let readAllLines =
    let args = fsi.CommandLineArgs

    args.[1] |> File.ReadAllLines

let readAllLinesAsGrid =
    let lines = readAllLines
    lines |> Array.map (fun line -> line |> splitStringToArray)

let readSingleLine =
    let lines = readAllLines
    lines.[0]

let countOccurrences v =
    v
    |> Seq.groupBy id
    |> Seq.map (fun (key, values) -> key, Seq.length values)
    |> Map.ofSeq

let rec insertAtEveryPosition x lst =
    seq {
        match lst with
        | [] -> yield [ x ]
        | head :: tail ->
            yield x :: lst

            for rest in insertAtEveryPosition x tail do
                yield head :: rest
    }

let rec permutations lst =
    seq {
        match lst with
        | [] -> yield []
        | head :: tail ->
            for perm in permutations tail do
                yield! insertAtEveryPosition head perm
    }

let printGridWithIndices (grid: 'a[][]) =
    printf "  "

    for j in 0 .. grid.[0].Length - 1 do
        printf " %A" (j % 10)

    printfn ""

    for i in 0 .. grid.Length - 1 do
        printf " %d " i

        for j in 0 .. grid.[i].Length - 1 do
            match box grid.[i].[j] with
            | :? string as s -> printf "%s " s
            | :? int64 as i -> printf "%d" i
            | _ -> printf "%A " grid.[i].[j]
        // printf "%A " grid.[i].[j]

        printfn ""

let printGridWithIndicesNoSpread (grid: 'a[][]) =
    printf "  "

    for j in 0 .. grid.[0].Length - 1 do
        printf "%A" (j % 10)

    printfn ""

    for i in 0 .. grid.Length - 1 do
        printf "%d " i

        for j in 0 .. grid.[i].Length - 1 do
            match box grid.[i].[j] with
            | :? string as s -> printf "%s" s
            | :? int64 as i -> printf "%d" i
            | _ -> printf "%A" grid.[i].[j]

        printfn ""
