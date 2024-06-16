import { global } from "./global.js";
import {
  fireHandEvent,
  registerColourPickers,
  registerDeleteKey,
  registerRightClick,
} from "./hand.js";
import { loadPresetName } from "./preset.js";
import { clearQueue, continueDrawingQueue } from "./draw.js";
import { COLOUR_HEXES } from "./colour.js";
import { registerMouseWheel, updateZoom } from "./zoom.js";

//======//
// MAIN //
//======//
const { show } = global;
show.resize = (context) => {
  // Oversize the canvas to ensure a square canvas (messy fix for dodgy rotation)
  const { canvas } = context;
  const { width, height } = canvas;
  const max = Math.max(width, height);
  canvas.width = max;
  canvas.height = max;
  canvas.style["width"] = max;
  canvas.style["height"] = max;

  const { queue, world } = global;
  clearQueue(context, queue, world);
  show.tick(context);
};

show.tick = () => {
  const { update } = global;
  update(global);
};

show.supertick = (context) => {
  const { queue, hand, zoomer, world, colours } = global;
  fireHandEvent(context, hand, "tick", global);
  updateZoom(context, queue, zoomer, world, colours);
  continueDrawingQueue(context, queue);
};

registerColourPickers(global.hand, COLOUR_HEXES, global.colours);
registerMouseWheel(global.zoomer);
registerRightClick();
registerDeleteKey(global.hand);
loadPresetName(global, "EMPTY");
