//========//
// VECTOR //
//========//
export const scaleVector = ([x, y], n) => [x * n, y * n]

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
	return ax*by - ay*bx
}

export const distanceBetweenVectors = (a, b) => {
	const displacement = subtractVector(a, b)
	const [dx, dy] = displacement
	const distance = Math.hypot(dx, dy)
	return distance
}