﻿#load "../utils/util.fsx"
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

type Pt = (int * int)

type Machine = { a: Pt; b: Pt; prize: Pt }

let parse =
    let mutable i = 0
    let mutable machines = []

    while i < lines.Length do
        let a = Regex.Match(lines.[i], "Button A: X\+(\d+), Y\+(\d+)")
        let b = Regex.Match(lines.[i + 1], "Button B: X\+(\d+), Y\+(\d+)")
        let prize = Regex.Match(lines.[i + 2], "Prize: X=(\d+), Y=(\d+)")

        // printfn "%s" lines.[i]
        // printfn "%s" lines.[i + 1]
        // printfn "%s" lines.[i + 2]
        // printfn "%A %A %A" a b prize

        let parseMatch (m: Match) =
            (int m.Groups.[1].Value, int m.Groups.[2].Value)

        let machine =
            { a = parseMatch a
              b = parseMatch b
              prize = parseMatch prize }

        machines <- machine :: machines
        i <- i + 4

    machines

let machines = parse
// printfn "%A" machines

let solve (machine: Machine) =

    let div = (fst machine.a) * (snd machine.b) - (snd machine.a) * (fst machine.b)

    let x =
        ((snd machine.b) * (fst machine.prize) - (fst machine.b) * (snd machine.prize))
        / div

    let y =
        ((fst machine.a) * (snd machine.prize) - (snd machine.a) * (fst machine.prize))
        / div

    if
        x * (fst machine.a) + y * (fst machine.b) = (fst machine.prize)
        && x * (snd machine.a) + y * (snd machine.b) = (snd machine.prize)
    then
        Some(x * 3 + y)
    else
        None

machines |> List.choose solve |> List.sum |> printfn "%A"
