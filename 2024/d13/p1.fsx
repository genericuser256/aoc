#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap

let lines = readAllLines

type Pt = (int * int)

type Machine = { a: Pt; b: Pt; prize: Pt }

let parse =
    let mutable i = 0
    let mutable machines = []

    while i < lines.Length do
        let a = Regex.Match(lines.[i], "Button A: X([+-])(\d+), Y([+-])(\d+)")
        let b = Regex.Match(lines.[i + 1], "Button B: X([+-])(\d+), Y([+-])(\d+)")
        let prize = Regex.Match(lines.[i + 2], "Prize: X=(-?)(\d+), Y=(-?)(\d+)")

        let parseMatch (m: Match) =
            (int m.Groups.[2].Value, int m.Groups.[4].Value)

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
    let step ((x, y): Pt) ((dx, dy): Pt) = (x + dx), (y + dy)

    let atPrize ((x, y): Pt) =
        x = fst machine.prize && y = snd machine.prize

    let tooFar ((x, y): Pt) =
        x > fst machine.prize || y > snd machine.prize

    let cost' a b = a * 3 + b

    let mutable min = Int32.MaxValue

    let rec solve' (pt: Pt) (sa: int) (sb: int) =
        let cost = cost' sa sb
        printfn "%A %A %A %A" pt sa sb cost

        if cost > 180 || cost > min || tooFar pt then
            ()
        else if atPrize pt then
            min <- cost
        else
            solve' (step pt machine.a) (sa + 1) sb
            solve' (step pt machine.b) sa (sb + 1)
            ()

    solve' (0, 0) 0 0
    if min = Int32.MaxValue then None else Some(min)

machines |> List.choose solve |> printfn "%A"
