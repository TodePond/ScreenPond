import { getCanvasPositions, getRelativePositions } from "./position.js";
import { makeScreen } from "./screen.js";

//======//
// DRAW //
//======//
// This file contains primitive + agnostic drawing functions
// For higher-level drawing functions, go to 'colour.js'
export const SCREEN_BORDER_WIDTH = 2;
export const drawBorder = (context, screen) => {
  const { colour, corners } = screen;
  //   fillBackground(context, { colour: Colour.Black, corners });

  const canvasCornerPositions = getCanvasPositions(context, corners);
  const [a, b, c, d] = canvasCornerPositions;

  let { depth } = screen;

  //   console.log(depth);
  // context.globalAlpha = 1 - depth / 500;
  //   if (context.globalAlpha <= 0.1) return;
  context.beginPath();
  context.moveTo(...a);
  context.lineTo(...b);
  context.lineTo(...d);
  context.lineTo(...c);
  context.closePath();

  context.fillStyle = "#232940ff";
  context.fill();

  context.lineWidth = SCREEN_BORDER_WIDTH;
  context.strokeStyle = colour.hex;
  context.stroke();

  context.fillStyle = "white";
  context.font = `${30 / devicePixelRatio}px Arial`;
  context.fillText(
    `${corners[0][0].toFixed(2)}, ${corners[0][1].toFixed(2)}`,
    a[0] + 10 / devicePixelRatio,
    a[1] - 10 / devicePixelRatio
  );

  context.fillText(
    `${corners[1][0].toFixed(2)}, ${corners[1][1].toFixed(2)}`,
    b[0] + 10 / devicePixelRatio,
    b[1] - 10 / devicePixelRatio
  );

  context.fillText(
    `${corners[2][0].toFixed(2)}, ${corners[2][1].toFixed(2)}`,
    c[0] + 10 / devicePixelRatio,
    c[1] - 10 / devicePixelRatio
  );

  context.fillText(
    `${corners[3][0].toFixed(2)}, ${corners[3][1].toFixed(2)}`,
    d[0] + 10 / devicePixelRatio,
    d[1] - 10 / devicePixelRatio
  );

  context.beginPath();
  context.arc(a[0], a[1], 8 / devicePixelRatio, 0, 2 * Math.PI);
  context.fill();

  context.beginPath();
  context.arc(b[0], b[1], 8 / devicePixelRatio, 0, 2 * Math.PI);
  context.fill();

  context.beginPath();
  context.arc(c[0], c[1], 8 / devicePixelRatio, 0, 2 * Math.PI);
  context.fill();

  context.beginPath();
  context.arc(d[0], d[1], 8 / devicePixelRatio, 0, 2 * Math.PI);
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
    queue.push({ ...screen, depth: parent.depth + 1 });
    i++;
  }
  return i;
};

export const DRAW_COUNT = 2_000;
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
