import { VIEW_CORNERS } from "./corners.js"
import { clearQueue } from "./draw.js"
import { getMousePosition, getZoomedPositions } from "./position.js"
import { setWorldCorners } from "./world.js"

//======//
// ZOOM //
//======//
export const makeZoomer = () => {
	const zoomer = {
		speed: 0.0,
		desiredSpeed: 0.0,
	}
	return zoomer
}

export const registerMouseWheel = (zoomer) => {
	
	on.mousewheel(e => {
		const dspeed = Math.sign(e.deltaY)
		zoomer.desiredSpeed += dspeed
	})

	on.keydown(e => {
		if (e.key === "r") {
			zoomer.desiredSpeed = 0.0
		}
	})

}

export const updateZoom = (context, queue, zoomer, world, colours) => {

	const missingSpeed = zoomer.desiredSpeed - zoomer.speed
	
	zoomer.speed += Math.sign(missingSpeed) * 0.15
	
	if (Math.abs(zoomer.speed) < 0.001) {
		zoomer.speed = 0.0
	}

	if (zoomer.speed === 0.0) return

	const mousePosition = getMousePosition(context, VIEW_CORNERS)
	const zoomedCorners = getZoomedPositions(world.corners, 1.0 + (zoomer.speed * -0.002), mousePosition)
	setWorldCorners(world, zoomedCorners, colours)
	clearQueue(context, queue, world)
}

