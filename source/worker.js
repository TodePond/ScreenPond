//========//
// WORKER //
//========//
const work = {
	canvas: undefined,
	context: undefined,
	hex: undefined,
	colour: undefined,
}

onmessage = ({data}) => {
	const {funcName, args} = data
	const func = FUNC[funcName]
	if (func === undefined) {
		throw new Error(`Couldn't find worker function ${funcName}`)
	}
	func(...args)
}

const FUNC = {}

FUNC.receiveCanvas = (canvas) => {
	work.canvas = canvas
	work.context = canvas.getContext("2d")
}

FUNC.tick = () => {
	const {canvas} = work
	const image = canvas.transferToImageBitmap()
	postMessage(image)
}