import { getColourParents } from "./colour.js";
import {
  getAddedCorners,
  getClonedCorners,
  getCornersPosition,
  getMovedCorners,
  getSubtractedCorners,
  makeRectangleCorners,
  VIEW_CORNERS,
} from "./corners.js";
import { getMappedPositionPart, PART_TYPE } from "./part.js";
import { getMappedPositions, getRelativePositions } from "./position.js";
import { addStep, getDrawnScreenFromRoute, makeRoute } from "./route.js";
import { makeScreen } from "./screen.js";

//=======//
// WORLD //
//=======//
export const makeWorld = (colours) => {
  const colour = colours[GREY];
  const corners = makeRectangleCorners(0, 0, 1, 1);
  const world = makeScreen(colour, corners);
  return world;
};

export const setWorldCorners = (world, corners, colours) => {
  world.corners = corners;

  // Check if any children fill the whole world
  for (const child of world.colour.screens) {
    const relativeChildCorners = getRelativePositions(
      child.corners,
      world.corners
    );
    const mappedViewCorners = getMappedPositions(
      VIEW_CORNERS,
      relativeChildCorners
    );

    const parts = mappedViewCorners.map((corner) =>
      getMappedPositionPart(corner)
    );
    if (parts.every((part) => part.type === PART_TYPE.INSIDE)) {
      world.colour = child.colour;
      world.corners = relativeChildCorners;
      return;
    }
  }

  // Check that all world corners are outside the view
  const mappedViewCorners = getMappedPositions(VIEW_CORNERS, corners);
  const parts = mappedViewCorners.map((corner) =>
    getMappedPositionPart(corner)
  );
  if (parts.every((part) => part.type === PART_TYPE.INSIDE)) {
    return;
  }

  const parents = getColourParents(world.colour, colours);
  if (parents.length === 0) return;

  world.colour.parentNumber++;
  if (world.colour.parentNumber >= parents.length) {
    world.colour.parentNumber = 0;
  }

  const parent = parents[world.colour.parentNumber];
  const parentCorners = getRelativePositions(parent.corners, world.corners);

  const child = parent.colour.screens[parent.number];
  const relativeChildCorners = getRelativePositions(
    child.corners,
    parentCorners
  );
  const viewChildCorners = getMappedPositions(
    VIEW_CORNERS,
    relativeChildCorners
  );

  const difference = getSubtractedCorners(mappedViewCorners, viewChildCorners);
  const yankedCorners = getAddedCorners(parentCorners, difference);

  world.corners = yankedCorners;
  world.colour = parent.colour;
};
