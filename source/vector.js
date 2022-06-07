//========//
// VECTOR //
//========//
export const addVector = (a, b) => {
	const [ax, ay] = a
	const [bx, by] = b
	const x = ax + bx
	const y = ay + by
	return [x, y]
}

export const subtractVector = (a, b) => {
	const [ax, ay] = a
	const [bx, by] = b
	const x = ax - bx
	const y = ay - by
	return [x, y]
}

export const crossProductVector = (a, b) => {
	const [ax, ay] = a
	const [bx, by] = b
	return (ax * bx) - (ay * by)
}

export const scaleVector = ([x, y], n) => [x * n, y * n]