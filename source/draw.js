import { getCanvasPositions, getRelativePositions } from "./position.js";
import { makeScreen } from "./screen.js";

//======//
// DRAW //
//======//
// This file contains primitive + agnostic drawing functions
// For higher-level drawing functions, go to 'colour.js'
export const SCREEN_BORDER_WIDTH = 1;
export const drawBorder = (context, screen) => {
  const { colour, corners } = screen;
  //   fillBackground(context, { colour: Colour.Black, corners });

  const canvasCornerPositions = getCanvasPositions(context, corners);
  const [a, b, c, d] = canvasCornerPositions;

  let { depth } = screen;

  //   console.log(depth);
  const overflow = depth - 500;
  if (overflow > 0) {
    const alpha = 1 - overflow / 500;
    if (alpha < 0.01) return;
    context.globalAlpha = 1 - overflow / 500;
  }
  //   if (context.globalAlpha <= 0.1) return;
  context.beginPath();
  context.moveTo(...a);
  context.lineTo(...b);
  context.lineTo(...d);
  context.lineTo(...c);
  context.closePath();

  // context.fillStyle = "#232940aa";
  context.fillStyle = colour.hex + "ff";
  context.fill();

  context.lineWidth = SCREEN_BORDER_WIDTH;
  // context.strokeStyle = colour.hex + "aa";
  // context.strokeStyle = "#232940aa";
  context.stroke();
  if (overflow > 0) {
    context.globalAlpha = 1;
  }
};

export const fillBackground = (context, screen) => {
  const { colour, corners } = screen;
  const canvasCornerPositions = getCanvasPositions(context, corners);
  const [a, b, c, d] = canvasCornerPositions;

  context.beginPath();
  context.moveTo(...a);
  context.lineTo(...b);
  context.lineTo(...d);
  context.lineTo(...c);
  context.closePath();

  context.fillStyle = colour.hex;
  context.fill();
};

//=======//
// QUEUE //
//=======//
export const clearQueue = (context, queue, world) => {
  const { canvas } = context;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const { colour } = world;
  const screen = makeScreen(colour, world.corners);
  queue.clear();
  queue.push({ ...screen, depth: 0 });
};

export const addChildrenToQueue = (queue, parent) => {
  let i = 1;
  const { colour, corners } = parent;
  for (let c = colour.screens.length - 1; c >= 0; c--) {
    const child = colour.screens[c];
    const relativeCorners = getRelativePositions(child.corners, corners);
    const screen = makeScreen(child.colour, relativeCorners);
    const depth = parent.depth + 1;
    if (depth < 1000) {
      queue.push({ ...screen, depth: parent.depth + 1 });
      i++;
    }
  }
  return i;
};

export const DRAW_COUNT = 6_000;
export const continueDrawingQueue = (context, queue) => {
  // If the draw queue is empty, that means we've drawn everything already :)
  if (queue.isEmpty) {
    return;
  }

  let i = 0;
  while (!queue.isEmpty) {
    if (i >= DRAW_COUNT) break;
    const screen = queue.shift();
    drawBorder(context, screen);
    i += addChildrenToQueue(queue, screen);
  }
};
