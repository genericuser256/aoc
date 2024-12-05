module multimap

open System.Collections.Generic
open FSharp.Collections

type Multimap<'Key, 'Value when 'Value: comparison> = Dictionary<'Key, Set<'Value>>


let getValues (multimap: Multimap<'Key, 'Value>) key =
    match multimap.TryGetValue(key) with
    | true, values -> values
    | false, _ -> set []

let addValue (multimap: Multimap<'Key, 'Value>) key value =
    if multimap.ContainsKey(key) then
        multimap.[key] <- multimap.[key].Add(value)
    else
        multimap.[key] <- Set([ value ])

let removeValue (multimap: Multimap<'Key, 'Value>) key value =
    if getValues multimap key |> Set.contains value then
        multimap.[key] <- multimap.[key].Remove(value)
        true
    else
        false

let hasKey (multimap: Multimap<'Key, 'Value>) key = multimap.ContainsKey(key)

let keyHasValue (multimap: Multimap<'Key, 'Value>) key value =
    match multimap.TryGetValue(key) with
    | true, values -> values.Contains(value)
    | false, _ -> false

let groupByFirstItem (pairs: seq<'Key * 'Value>) =
    let multimap = Multimap<'Key, 'Value>()

    for (key, value) in pairs do
        addValue multimap key value

    multimap

let groupBySecondItem (pairs: seq<'Value * 'Key>) =
    let multimap = Multimap<'Key, 'Value>()

    for (value, key) in pairs do
        addValue multimap key value

    multimap
