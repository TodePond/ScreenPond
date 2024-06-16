import { bilerp, ibilerp } from "./lerp.js";
import { getZeroedCorners } from "./corners.js";

//======//
// VIEW //
//======//
export const getViewPosition = (context, canvasPosition) => {
  const { canvas } = context;
  const [x, y] = canvasPosition;
  const viewPosition = [x / canvas.width, y / canvas.height];
  return viewPosition;
};

export const getCanvasPosition = (context, viewPosition) => {
  const { canvas } = context;
  const [x, y] = viewPosition;
  const canvasPosition = [x * canvas.width, y * canvas.height];
  return canvasPosition;
};

export const getCanvasPositions = (context, viewPositions) => {
  const canvasPositions = viewPositions.map((viewPosition) =>
    getCanvasPosition(context, viewPosition)
  );
  return canvasPositions;
};

export const getMousePosition = (context, corners) => {
  const viewPosition = getViewPosition(context, Mouse.position);
  const position = getMappedPosition(viewPosition, corners);
  return position;
};

// HIGHER screen position -> DEEPER screen position
//
// Position... within a higher screen
// Corners... of a deeper screen
// Return: Where the position would be, if it was inside the deeper screen (instead of the higher screen)
export const getRelativePosition = (position, corners) => {
  const relativePosition = bilerp(position, corners);
  return relativePosition;
};

export const getRelativePositions = (positions, corners) => {
  const relativePositions = positions.map((position) =>
    getRelativePosition(position, corners)
  );
  return relativePositions;
};

// DEEPER screen position -> HIGHER screen position
//
// Position... within a higher screen
// Corners... of a deeper screen
// Return: If we treat the deeper screen as the co-ordinates, where should we place the position?
export const getMappedPosition = (position, corners, safe = true) => {
  const mappedPosition = ibilerp(position, corners);
  if (!safe) return mappedPosition;
  return mappedPosition.map((axis) => (isNaN(axis) ? 0 : axis));
};

export const getMappedPositions = (positions, corners) => {
  const mappedPositions = positions.map((position) =>
    getMappedPosition(position, corners)
  );
  return mappedPositions;
};

export const getRotatedPosition = (position, origin, angle) => {
  const [px, py] = position;
  const [ox, oy] = origin;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dy = py - oy;
  const dx = px - ox;

  const x = dx * cos + dy * sin + ox;
  const y = dy * cos - dx * sin + oy;
  return [x, y];
};

export const isPositionInCorners = (position, corners, pity = [0, 0]) => {
  const mappedPosition = getMappedPosition(position, corners);
  return isMappedPositionInCorners(mappedPosition, pity);
};

export const isMappedPositionInCorners = (position, pity = [0, 0]) => {
  const [x, y] = position;
  const [px, py] = pity;
  if (x <= 0.0 - px) return false;
  if (x >= 1.0 + px) return false;
  if (y <= 0.0 - py) return false;
  if (y >= 1.0 + py) return false;
  return true;
};

export const getScaledPosition = (position, corners) => {
  const zeroedCorners = getZeroedCorners(corners);
  const scaledPosition = getMappedPosition(position, zeroedCorners);
  return scaledPosition;
};

export const getZoomedPosition = (position, zoom, origin) => {
  const [x, y] = position;
  const [ox, oy] = origin;
  const originedPosition = [x - ox, y - oy];

  const zoomedPosition = originedPosition.map((axis) => axis * zoom);

  const [zx, zy] = zoomedPosition;
  const movedPosition = [zx + ox, zy + oy];

  return movedPosition;
};

export const getZoomedPositions = (positions, zoom, origin) => {
  const zoomedPositions = positions.map((position) =>
    getZoomedPosition(position, zoom, origin)
  );
  return zoomedPositions;
};
