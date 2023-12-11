// Array.prototype.peek = map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];

interface Array<T> {
    peek(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): T[];
}