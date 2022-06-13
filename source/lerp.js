import { addVector, subtractVector, crossProductVector } from "./vector.js"

//======//
// LERP //
//======//
export const lerp = (distance, line) => {

	const [a, b] = line
	const [ax, ay] = a
	const [bx, by] = b
	
	const x = ax + (bx - ax) * distance
	const y = ay + (by - ay) * distance

	const point = [x, y]
	return point

}

export const bilerp = (displacement, corners) => {

	const [dx, dy] = displacement
	const [a, b, c, d] = corners

	const la = lerp(dx, [a, b])
	const lb = lerp(dx, [c, d])
	const line = [la, lb]

	const point = lerp(dy, line)
	return point
}

// https://iquilezles.org/articles/ibilinear/
export const ibilerp = (point, corners) => {

	const p = point
	const [a, b, d, c] = corners

	const e = subtractVector(b, a)
	const f = subtractVector(d, a)
	const g = addVector(subtractVector(a, b), subtractVector(c, d))
	const h = subtractVector(p, a)

	const k2 = crossProductVector(g, f)
	const k1 = crossProductVector(e, f) + crossProductVector(h, g)
	const k0 = crossProductVector(h, e)
		
	// if edges are parallel, this is a linear equation
	if (Math.abs(k2) < 0.001) {
		const x = (h[0]*k1+f[0]*k0) / (e[0]*k1-g[0]*k0)
		const y = -k0/k1
		return [x, y]
	} else { // otherwise, it's a quadratic
		let w = k1*k1 - 4*k0*k2

		//if (w < 0) return [-1, -1]
		w = Math.sqrt(w)

		const ik2 = 0.5/k2
		let v = (-k1 - w)*ik2
		let u = (h[0] - f[0]*v)/(e[0] + g[0]*v)

		if (u<0.0 || u>1.0 || v<0.0 || v>1.0) {
			v = (-k1 + w)*ik2
			u = (h[0] - f[0]*v)/(e[0] + g[0]*v)
		}
		return [u, v]
	}
}