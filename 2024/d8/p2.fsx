#load "../utils/util.fs"
#load "../utils/multimap.fs"

open System
open System.IO
open System.Text.RegularExpressions
open utils
open multimap


let args = fsi.CommandLineArgs

let lines =
    args.[1]
    |> File.ReadAllLines
    |> Array.map (fun line -> line.Split(":"))
    |> Array.map (fun line ->
        (int64 line.[0], line.[1].Trim().Split(" ") |> Array.map (fun num -> int64 num) |> List.ofArray))

type Op =
    | Add
    | Mul
    | Con

let evaluate (a: int64, b: int64, op: Op) =
    match op with
    | Add -> a + b
    | Mul -> a * b
    | Con -> int64 (a.ToString() + b.ToString())

let rec genSolutions' (nums: int64 list, op: Op, acc: int64, goal: int64) =
    // printfn "%A %A %A %A" nums op acc goal

    if acc > goal then
        []
    else

        match nums with
        | [] -> [ acc ]
        | head :: tail ->
            genSolutions' (tail, Add, evaluate (acc, head, op), goal)
            |> List.append (genSolutions' (tail, Mul, evaluate (acc, head, op), goal))
            |> List.append (genSolutions' (tail, Con, evaluate (acc, head, op), goal))


let rec genSolutions (nums: int64 list, goal: int64) =
    match nums with
    | [] -> raise (Exception("bad state"))
    | head :: tail ->
        genSolutions' (tail, Add, head, goal)
        |> List.append (genSolutions' (tail, Mul, head, goal))
        |> List.append (genSolutions' (tail, Con, head, goal))

let countSolutions (goal: int64, nums: int64 list) =
    genSolutions (nums, goal) |> Seq.filter (fun x -> x = goal) |> Seq.length

let result =
    lines
    |> Seq.map (fun (goal, nums) -> countSolutions (goal, nums), goal)
    |> Seq.map (fun (solutions, goal) -> if solutions > 0 then goal else 0)
    |> Seq.sum


printfn "%A" result
