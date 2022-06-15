//======//
// PART //
//======//
export const PART_TYPE = {
	OUTSIDE: Symbol("PART_TYPE.OUTSIDE"),
	INSIDE: Symbol("PART_TYPE.INSIDE"),
	EDGE: Symbol("PART_TYPE.EDGE"),
	CORNER: Symbol("PART_TYPE.CORNER"),
}

export const makePart = (type, number = 0) => {
	return {type, number}
}