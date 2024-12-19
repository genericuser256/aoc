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
    let mutable boxesRight = []
    let mutable robot = (0, 0)

    while warehouse do
        warehouse <- lines.[i].Length > 2

        if warehouse then
            lines.[i]
            |> Seq.iteri (fun x v ->
                match v with
                | '#' -> walls <- (2 * x, i) :: (2 * x + 1, i) :: walls
                | 'O' ->
                    boxes <- (2 * x, i) :: boxes
                    boxesRight <- (2 * x + 1, i) :: boxesRight
                | '@' -> robot <- (2 * x, i)
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


let printState () =
    let grid =
        (seq {
            for y in 0..height do
                yield
                    seq {
                        for x in 0..width do
                            if walls.Contains(x, y) then yield "#"
                            else if robot = (x, y) then yield "@"
                            else if boxes.Contains(x, y) then yield "["
                            else if boxes.Contains(x - 1, y) then yield "]"
                            else yield "."
                    }
                    |> Seq.toArray
         }
         |> Seq.toArray)

    printGridWithIndicesNoSpread grid
    printfn ""

let validate () =
    boxes
    |> Set.iter (fun (x, y) ->
        if walls.Contains(x, y) then
            printfn "walls.Contains(x, y) %A" (x, y)
            raise (Exception("bad state"))
        else if walls.Contains(x + 1, y) then
            printfn "walls.Contains(x + 1, y) %A" (x, y)
            raise (Exception("bad state"))
        else if robot = (x, y) then
            printfn "robot = (x, y) %A" (x, y)
            raise (Exception("bad state"))
        else if robot = (x + 1, y) then
            printfn "robot = (x + 1, y) %A" (x, y)
            raise (Exception("bad state")))

let rBoxContains pt = boxes.Contains pt
let lBoxContains pt = boxes.Contains(step pt Left)

let moveVert (pt: Pt) (dir: Dir) =

    let getBoxPts (pt: Pt) =
        if boxes.Contains(pt) then
            set [ pt; step pt Right ]
        elif boxes.Contains(step pt Left) then
            set [ step pt Left; pt ]
        else
            set []

    let boxesContains (pt: Pt) =
        if boxes.Contains(pt) then Some(pt)
        elif boxes.Contains(step pt Left) then Some(step pt Left)
        else None

    let anyIntersections pts =
        (pts |> Seq.tryPick boxesContains).IsSome

    let pt' = step pt dir
    let mutable pts = set [ pt' ]
    let mutable movedBox = false

    while anyIntersections pts do
        movedBox <- true

        printfn "moving boxes %A" pts
        pts <- pts |> Set.map getBoxPts |> Set.unionMany |> Set.map (fun pt -> step pt dir)

    if pts |> Seq.exists walls.Contains then
        printfn "pushed into wall"
        pt
    else if movedBox then
        printfn "\nmoved box %A" pts
        pts <- set [ pt' ]
        let mutable newBoxes = set []

        while anyIntersections pts do

            printfn "moving boxes %A" pts

            let pts' =
                pts |> Set.map getBoxPts |> Set.unionMany |> Set.map (fun pt -> step pt dir)

            for p in pts do
                let boxPt = boxesContains p

                if boxPt.IsSome then
                    newBoxes <- newBoxes.Add(step boxPt.Value dir)
                    boxes <- boxes.Remove boxPt.Value

            pts <- pts'

        printfn "new pts %A" pts

        boxes <- boxes |> Set.union newBoxes

        pt'
    else
        printfn "empty"
        pt'

let moveRight (pt: Pt) (dir: Dir) =
    let mutable pt' = step pt dir
    let initialMove = pt'

    while boxes.Contains(pt') do
        printfn "moving boxes %A" pt'
        pt' <- step (step pt' dir) dir

    if walls.Contains(pt') then
        printfn "pushed into wall"
        pt
    else if boxes.Contains(initialMove) then
        printfn "moved box %A %A" pt' (initialMove)
        pt' <- initialMove
        let mutable newBoxes = set []

        while boxes.Contains(pt') do
            printfn "moving boxes %A" pt'
            boxes <- boxes.Remove pt'
            newBoxes <- newBoxes.Add(step pt' dir)
            pt' <- step (step pt' dir) dir

        boxes <- boxes |> Set.union newBoxes
        initialMove
    else
        printfn "empty"
        pt'

let moveLeft (pt: Pt) (dir: Dir) =
    let boxesContains pt = boxes.Contains(step pt dir)

    let mutable pt' = step pt dir
    let initialMove = pt'
    let mutable pushedBox = false

    while boxesContains pt' do
        pushedBox <- true
        printfn "l %A next %A bc %A %A" pt' (step pt' dir) (step (step pt' dir) dir) (boxesContains (step pt' dir))
        pt' <- step (step pt' dir) dir

    printfn "pt' %A" pt'

    if
        (pushedBox && walls.Contains(step pt' Left))
        || (not pushedBox && walls.Contains(initialMove))
    then
        printfn "pushed into wall"
        pt
    else if pushedBox then
        printfn "moved box %A %A" pt' (initialMove)
        pt' <- initialMove
        let mutable newBoxes = set []

        while boxesContains pt' do
            printfn "moving boxes %A" pt'
            let boxPt = step pt' dir
            boxes <- boxes.Remove boxPt
            newBoxes <- newBoxes.Add(step boxPt dir)
            pt' <- step boxPt dir

        boxes <- boxes |> Set.union newBoxes
        initialMove
    else
        printfn "empty"
        pt'

let move (pt: Pt) (dir: Dir) =
    printfn "move %A -> %A, dir: %A " pt (step pt dir) dir
    // printState ()

    if dir = Up || dir = Down then moveVert pt dir
    else if dir = Right then moveRight pt dir
    else moveLeft pt dir

printState ()

validate ()

for dir in moves do
    robot <- move robot dir
    printfn "\nnew state"
    printState ()
    validate ()

// printState ()

let halfWidth = width / 2

let getGps (x, y) =
    if x < halfWidth then x + y * 100 else x + 1 + y * 100


boxes |> Seq.sumBy getGps |> printfn "%A"
