import { VIEW_CORNERS } from "./corners.js"
import { clearQueue } from "./draw.js"
import { getMousePosition, getZoomedPositions } from "./position.js"
import { setWorldCorners } from "./world.js"

//======//
// ZOOM //
//======//
export const makeZoomer = () => {
	const zoomer = {
		speed: 1.0,
	}
	return zoomer
}

export const registerMouseWheel = (zoomer) => {
	
	on.mousewheel(e => {
		const dspeed = e.deltaY * -0.0001
		zoomer.speed += dspeed
	})

}

export const updateZoom = (context, queue, zoomer, world, colours) => {

	if (zoomer.speed === 1.0) return

	const mousePosition = getMousePosition(context, VIEW_CORNERS)
	const zoomedCorners = getZoomedPositions(world.corners, zoomer.speed, mousePosition)
	setWorldCorners(world, zoomedCorners, colours)
	clearQueue(context, queue, world)
}

