#load "../utils/util.fs"
#load "../utils/multimap.fs"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap

type State = int64 array

let initialState = readSingleLine.Split(" ") |> Seq.map int64 |> Seq.toArray

let evenDigits num = (string num).Length % 2 = 0

let splitNum num =
    let str = string num
    let half = str.Length / 2
    let left = str.Substring(0, half) |> int64
    let right = str.Substring(half) |> int64
    [| left; right |]



let step (state: State) =
    // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
    // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
    //      The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
    //      (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
    // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
    state
    |> Array.map (fun stone ->
        match stone with
        | 0L -> [| 1L |]
        | _ when evenDigits stone -> splitNum (stone)
        | _ -> [| stone * 2024L |])
    |> Array.concat

let mutable state = initialState

// printfn "%A\n" state

for i in 1..25 do
    state <- step (state)
// printfn "%A: %A\n" i state

// printfn "%A %A" state.Length state
printfn "%A" state.Length
