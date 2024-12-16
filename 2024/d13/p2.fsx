#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


//
// Had to cheat on this one
//

let lines = readAllLines

type Pt = (int64 * int64)

type Machine = { a: Pt; b: Pt; prize: Pt }

let parse =
    let mutable i = 0
    let mutable machines = []

    while i < lines.Length do
        let a = Regex.Match(lines.[i], "Button A: X\+(\d+), Y\+(\d+)")
        let b = Regex.Match(lines.[i + 1], "Button B: X\+(\d+), Y\+(\d+)")
        let prize = Regex.Match(lines.[i + 2], "Prize: X=(\d+), Y=(\d+)")

        let parseMatch (m: Match) =
            (int64 m.Groups.[1].Value, int64 m.Groups.[2].Value)

        let parsePrize (m: Match) =
            (int64 m.Groups.[1].Value + 10000000000000L, int64 m.Groups.[2].Value + 10000000000000L)

        let machine =
            { a = parseMatch a
              b = parseMatch b
              prize = parsePrize prize }

        machines <- machine :: machines
        i <- i + 4

    machines

let machines = parse
// printfn "%A" machines

let solve (i: int, machine: Machine) =

    let div = (fst machine.a) * (snd machine.b) - (snd machine.a) * (fst machine.b)

    let x =
        ((snd machine.b) * (fst machine.prize) - (fst machine.b) * (snd machine.prize))
        / div

    let y =
        ((fst machine.a) * (snd machine.prize) - (snd machine.a) * (fst machine.prize))
        / div

    let solution = x * 3L + y

    if
        (x * (fst machine.a) + y * (fst machine.b)) = (fst machine.prize)
        && (x * (snd machine.a) + y * (snd machine.b)) = (snd machine.prize)
    then

        printfn "%A %A" i (solution - 100L)
        Some(solution)
    else
        None

machines |> List.indexed |> List.choose solve |> List.sum |> printfn "%A"
