import { add, sub, cross } from "./vector.js"

//======//
// LERP //
//======//
export const lerp = (t, a, b) => [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t]
export const bilerp = (t, [a, b, c, d]) => lerp(t[1], lerp(t[0], a, b), lerp(t[0], c, d))

// the magic transpiled from https://iquilezles.org/articles/ibilinear/
export const invBilinear = (p, [a, b, d, c]) => {
	const e = sub(b, a)
	const f = sub(d, a)
	const g = add(sub(a, b), sub(c, d))
	const h = sub(p, a)

	const k2 = cross(g, f)
	const k1 = cross(e, f) + cross(h, g)
	const k0 = cross(h, e)
		
	// if edges are parallel, this is a linear equation
	if (Math.abs(k2) < 0.001) {
		return [ (h[0]*k1+f[0]*k0)/(e[0]*k1-g[0]*k0), -k0/k1 ];
	} else { // otherwise, it's a quadratic
		let w = k1*k1 - 4*k0*k2;
		//if (w < 0) return [-1, -1];
		w = Math.sqrt(w);

		const ik2 = 0.5/k2;
		let v = (-k1 - w)*ik2;
		let u = (h[0] - f[0]*v)/(e[0] + g[0]*v);

		if (u<0.0 || u>1.0 || v<0.0 || v>1.0) {
			v = (-k1 + w)*ik2;
			u = (h[0] - f[0]*v)/(e[0] + g[0]*v);
		}
		return [u, v];
	}
}