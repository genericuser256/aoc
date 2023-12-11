type Falsy = false | 0 | "" | null | undefined;

interface BooleanConstructor {
  new (value?: any): Boolean;
  <A>(value: A | Falsy): x is A;
  readonly prototype: Boolean;
}

interface Array<T> {
  peek(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): T[];
  // ptAt(pt: Pt2d): T extends Array<U> ? U : never;
  // setAt(pt: Pt2d, value: T extends Array<U> ? U : never);
}

interface Array<T extends Array<U>> {
  ptAt(pt: Pt2d): U | undefined;
  setAt(pt: Pt2d, value: U);
}
// interface Array<T> {
//     peek(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): T[];
//     ptAt(pt: Pt2d): T extends Array<U> ? U : never;
//     setAt(pt: Pt2d, value: T extends Array<U> ? U : never);
// }
