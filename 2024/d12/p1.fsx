#load "../utils/util.fsx"
#load "../utils/multimap.fsx"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap

let grid = readAllLinesAsGrid

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

let allDirs = [ Up; Right; Down; Left ]

type Pos = (int * int)

let at ((x, y): Pos) : string = grid.[y].[x]

let inBounds ((x, y): Pos) =
    y >= 0 && y < grid.Length && x >= 0 && x < grid.[0].Length

let step ((x, y): Pos) (dir: Dir) =
    let dx, dy = dir.toStep ()
    (x + dx, y + dy)


let area (s: Set<Pos>) = s.Count

let perimeter (s: Set<Pos>) =
    s
    |> Seq.map (fun p -> allDirs |> Seq.filter (fun dir -> not (s.Contains(step p dir))) |> Seq.length)
    |> Seq.sum

// printGridWithIndices grid

let mutable plots: (string * Set<Pos>) array = [||]

for y in 0 .. grid.Length - 1 do
    for x in 0 .. grid.[0].Length - 1 do
        let p: Pos = (x, y)
        let v = at p

        let potentials: Pos list =
            match p with
            | (0, 0) -> []
            | (0, _) -> [ step p Up ]
            | (_, 0) -> [ step p Left ]
            | _ -> [ step p Up; step p Left ]
            |> List.filter (fun p' -> (at p') = v)

        match potentials with
        | [] ->
            // printfn "no %s for pos %A" v p
            plots <- Array.append plots [| (v, set [ p ]) |]
        | [ a ] ->
            let idx = plots |> Array.findIndex (fun (v, s) -> s.Contains(a))
            // printfn "ya %s at idx %A for pos %A, with existing %A" v idx p (snd plots.[idx])
            plots.[idx] <- (v, (snd plots.[idx]).Add(p))
        | [ a; b ] ->
            let idxA = plots |> Array.findIndex (fun (v, s) -> s.Contains(a))
            let idxB = plots |> Array.findIndexBack (fun (v, s) -> s.Contains(b))

            if idxA = idxB then
                let idx = plots |> Array.findIndex (fun (v, s) -> s.Contains(a))
                // printfn "ya %s at shared idx %A for pos %A, with existing %A" v idx p (snd plots.[idx])
                plots.[idx] <- (v, (snd plots.[idx]).Add(p))
            else
                // printfn
                //     "ya %s at idx %A and %A for pos %A, with existing %A, %A"
                //     v
                //     idxA
                //     idxB
                //     p
                //     (snd plots.[idxA])
                //     (snd plots.[idxB])

                let sA = snd plots.[idxA]
                let sB = snd plots.[idxB]
                plots <- plots |> Array.removeAt idxA

                let idxB' = plots |> Array.findIndex (fun (v, s) -> s.Contains(b))
                plots <- plots |> Array.removeAt idxB'
                plots <- Array.append plots [| (v, sA.Add(p) |> Set.union sB) |]
        | _ -> raise (Exception("Unhandled case for potentials"))

// if plots |> Set.exists (fun (v', locs) -> v' = v && locs.Contains(p)) |> not then
//     plots <- plots.Add(findPlot p)

// printfn "%A" plots

// plots
// |> Seq.iter (fun plot -> printfn "%A: A: %A P: %A" (fst plot) (area (snd plot)) (perimeter (snd plot)))

plots |> Seq.map (fun (v, s) -> area s * perimeter s) |> Seq.sum |> printfn "%A"
