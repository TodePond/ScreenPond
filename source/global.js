import { makeHand } from "./hand.js";
import { makeColours } from "./colour.js";
import { makeWorld } from "./world.js";
import { LinkedList } from "./list.js";
import { makeZoomer } from "./zoom.js";

//========//
// GLOBAL //
//========//
const colours = makeColours();
const hand = makeHand(colours);
const world = makeWorld(colours);
const queue = new LinkedList();
const show = Show.start();
const zoomer = makeZoomer();
const update = () => {};

export const global = {
  // Updating
  world,
  colours,
  update,

  // Drawing
  show,
  queue,

  // Interaction
  hand,
  zoomer,
};

window.global = global;
