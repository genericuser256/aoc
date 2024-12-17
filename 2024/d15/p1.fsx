#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap

type Pt = (int * int)

type Dir =
    | Up
    | Right
    | Down
    | Left

    member this.toStep() =
        match this with
        | Up -> (0, -1)
        | Right -> (1, 0)
        | Down -> (0, 1)
        | Left -> (-1, 0)

    member this.opposite() =
        match this with
        | Up -> Down
        | Right -> Left
        | Down -> Up
        | Left -> Right

    member this.rightTurn() =
        match this with
        | Up -> Right
        | Right -> Down
        | Down -> Left
        | Left -> Up

    member this.leftTurn() =
        match this with
        | Up -> Left
        | Right -> Up
        | Down -> Right
        | Left -> Down

let lines = readAllLines

let parse =
    let mutable warehouse = true
    let mutable i = 0
    let mutable walls = []
    let mutable boxes = []
    let mutable robot = (0, 0)

    while warehouse do
        warehouse <- lines.[i].Length > 2

        if warehouse then
            lines.[i]
            |> Seq.iteri (fun x v ->
                match v with
                | '#' -> walls <- (x, i) :: walls
                | 'O' -> boxes <- (x, i) :: boxes
                | '@' -> robot <- (x, i)
                | _ -> ())

            i <- i + 1
        else
            i <- i + 1

    let mutable moves = []

    while i < lines.Length do
        lines.[i]
        |> String.iter (fun v ->
            match v with
            | '^' -> moves <- Up :: moves
            | 'v' -> moves <- Down :: moves
            | '<' -> moves <- Left :: moves
            | '>' -> moves <- Right :: moves
            | _ -> raise (Exception(string v)))

        i <- i + 1

    (walls |> Set.ofList), (boxes |> Set.ofList), robot, (moves |> List.rev)

let mutable walls, boxes, robot, moves = parse

// printfn "%A %A %A %A" walls boxes robot moves

let width = walls |> Seq.map fst |> Seq.max
let height = walls |> Seq.map snd |> Seq.max

let step ((x, y): Pt) (dir: Dir) =
    let dx, dy = dir.toStep ()
    (x + dx, y + dy)


let validate =
    boxes
    |> Set.iter (fun b ->
        if walls.Contains(b) || robot = b then
            raise (Exception("bad state")))

let move (pt: Pt) (dir: Dir) =
    // printfn "move %A %A" pt dir
    let mutable pt' = step pt dir

    while boxes.Contains(pt') do
        // printfn "moving boxes %A" pt'
        pt' <- step pt' dir

    if walls.Contains(pt') then
        // printfn "pushed into wall"
        pt
    else if boxes.Contains(step pt dir) then
        // printfn "moved box"
        boxes <- boxes.Add pt'
        pt' <- step pt dir
        boxes <- boxes.Remove pt'
        pt'
    else
        // printfn "empty"
        pt'


let printState () =
    for y in 0..height do
        for x in 0..width do
            if walls.Contains(x, y) then printf "#"
            else if boxes.Contains(x, y) then printf "O"
            else if robot = (x, y) then printf "@"
            else printf "."

        printfn ""

    printfn ""


for dir in moves do
    // printState ()
    robot <- move robot dir
    validate

// printState ()

boxes |> Seq.sumBy (fun (x, y) -> x + y * 100) |> printfn "%A"
