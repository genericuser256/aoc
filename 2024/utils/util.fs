module utils

open System.IO

let countOccurrences (arr: 'T[]) =
    arr
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
