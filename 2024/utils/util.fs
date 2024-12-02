module utils

open System.IO

let countOccurrences (arr: 'T[]) =
    // Group the array elements, count occurrences, and put them into a sequence of key-value pairs
    arr
    |> Seq.groupBy id // Group by the number itself
    |> Seq.map (fun (key, values) -> key, Seq.length values) // Create tuples (number, count)
    |> Map.ofSeq // Convert the sequence to a Map
