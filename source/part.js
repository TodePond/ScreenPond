import { wrap } from "./number.js";

//======//
// PART //
//======//
// Corners
// 0 1
// 2 3
//
// Edges
//  0
// 1 2
//  3
export const getEdgeCorners = (edgeNumber) => {
  const unwrappedCornerNumbers = [edgeNumber - 1, edgeNumber + 1];
  const cornerNumbers = unwrappedCornerNumbers.map((v) => wrap(v, 0, 3));
  return cornerNumbers;
};

export const PART_TYPE = {
  OUTSIDE: Symbol("PART_TYPE.OUTSIDE"),
  INSIDE: Symbol("PART_TYPE.INSIDE"),
  EDGE: Symbol("PART_TYPE.EDGE"),
  CORNER: Symbol("PART_TYPE.CORNER"),
  UNKNOWN: Symbol("PART_TYPE.UNKNOWN"),
  IGNORE: Symbol("PART_TYPE.IGNORE"),
};

export const makePart = (type, number = 0) => {
  return { type, number };
};

export const PART_OUTSIDE_PITY_SCALE = 1.0;
export const getMappedPositionPart = (position, pity = [0, 0]) => {
  const [x, y] = position;
  const [px, py] = pity.map((axis) => Math.min(0.25, axis));

  if (x <= 0.0 - px * PART_OUTSIDE_PITY_SCALE)
    return makePart(PART_TYPE.OUTSIDE);
  if (x >= 1.0 + px * PART_OUTSIDE_PITY_SCALE)
    return makePart(PART_TYPE.OUTSIDE);
  if (y <= 0.0 - py * PART_OUTSIDE_PITY_SCALE)
    return makePart(PART_TYPE.OUTSIDE);
  if (y >= 1.0 + py * PART_OUTSIDE_PITY_SCALE)
    return makePart(PART_TYPE.OUTSIDE);

  // Left Edge
  if (x <= 0.0 + px) {
    if (y <= 0.0 + py) return makePart(PART_TYPE.CORNER, 0);
    if (y >= 1.0 - py) return makePart(PART_TYPE.CORNER, 2);
    return makePart(PART_TYPE.EDGE, 1);
  }

  // Right Edge
  if (x >= 1.0 - px) {
    if (y <= 0.0 + py) return makePart(PART_TYPE.CORNER, 1);
    if (y >= 1.0 - py) return makePart(PART_TYPE.CORNER, 3);
    return makePart(PART_TYPE.EDGE, 2);
  }

  // Top + Bottom Edges
  if (y <= 0.0 + py) return makePart(PART_TYPE.EDGE, 0);
  if (y >= 1.0 - py) return makePart(PART_TYPE.EDGE, 3);

  return makePart(PART_TYPE.INSIDE);
};
