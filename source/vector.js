//========//
// VECTOR //
//========//
export const add = (a, b) => [a[0]+b[0], a[1]+b[1]]
export const sub = (a, b) => [a[0]-b[0], a[1]-b[1]]
export const cross = (a, b) => a[0]*b[1] - a[1]*b[0]