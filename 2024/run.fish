set day $argv[1]

if test -z $argv[2]
    set part "1"
else
    set part $argv[2]
end

if test -z $argv[3]
    set useInput "e"
else
    set useInput $argv[3]
end

echo "Running day $day part $part with input $useInput"

if contains $useInput i t 1 true
    dotnet fsi "$day/$day""p$part.fsx" -- "$day/input.txt"
else
    dotnet fsi "$day/$day""p$part.fsx" -- "$day/example.txt"
end
