import { VIEW_CORNERS } from "./corners.js"
import { clearQueue } from "./draw.js"
import { onkeydown } from "./keyboard.js"
import { getMousePosition, getZoomedPositions } from "./position.js"
import { setWorldCorners } from "./world.js"

//======//
// ZOOM //
//======//
export const makeZoomer = () => {
	const zoomer = {
		speed: 0.0,
		desiredSpeed: 0.0,
		smoothMode: false,
	}
	return zoomer
}

export const registerMouseWheel = (zoomer) => {

	onkeydown("z", () => zoomer.smoothMode = !zoomer.smoothMode)
	onkeydown("r", () => zoomer.desiredSpeed = 0.0)

	on.wheel(e => {
		const dspeed = Math.sign(e.deltaY)
		zoomer.desiredSpeed += dspeed * (zoomer.smoothMode? 1 : 10)
	})

}

export const updateZoom = (context, queue, zoomer, world, colours) => {

	const missingSpeed = zoomer.desiredSpeed - zoomer.speed
	
	zoomer.speed += Math.sign(missingSpeed) * 0.15
	if (!zoomer.smoothMode) zoomer.speed = zoomer.desiredSpeed


	if (Math.abs(zoomer.speed) < 0.001) {
		zoomer.speed = 0.0
	}
	if (zoomer.speed === 0.0) return

	if (!zoomer.smoothMode) {
		zoomer.desiredSpeed *= 0.8
		if (Math.abs(zoomer.desiredSpeed) < 0.001) {
			zoomer.desiredSpeed = 0.0
		}
	}

	const mousePosition = getMousePosition(context, VIEW_CORNERS)
	const zoomedCorners = getZoomedPositions(world.corners, 1.0 + (zoomer.speed * -0.002), mousePosition)
	setWorldCorners(world, zoomedCorners, colours)
	clearQueue(context, queue, world)

}

