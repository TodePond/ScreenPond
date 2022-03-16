//========//
// CONFIG //
//========//
const BORDER_THICKNESS = 5

//======//
// LIST //
//======//
const makeList = (start) => {

	const list = {
		start,
		*[Symbol.iterator]() {
			let link = this.start
			while (link !== undefined) {
				yield link.value
				link = link.next
			}
		},
	}
	return list
}

const makeLink = (value) => {
	const link = {
		next: undefined,
		previous: undefined,
		value,
	}
	return link
}

const addToStartOfList = (list, value) => {

	const link = makeLink(value)

	if (list.start === undefined) {
		list.start = link
		return
	}

	if (list.start.previous !== undefined) {
		list.start.previous.next = link
	}

	list.start.previous = link
	link.next = list.start

	list.start = link

}

const insertAfterLink = (link, value) => {

	if (link.next !== undefined) {
		link.next.previous = undefined
	}

	const nextLink = makeLink(value)

	link.next = nextLink
	nextLink.previous = link
}

const deleteLinkFromList = (list, link) => {
	if (list.start === link) {
		list.start = link.next
	}

	if (link.next !== undefined) {
		link.next.previous = link.previous
	}

	if (link.previous !== undefined) {
		link.previous.next = link.next
	}
}

//========//
// COLOUR //
//========//
const colours = []

Colour.splash()
for (let i = 0; i < 1000; i++) {
	const screens = makeList()
	colours.push(screens)
}

//========//
// SCREEN //
//========//
const makeScreen = ({
	colour = Colour.Blue.splash,
	x = 0,
	y = 0,
	width = 50,
	height = 50,
} = {}) => {
	const screen = {
		colour,
		x, y,
		width, height,
	}
	return screen
}

const registerScreen = (screen) => {
	addToStartOfList(colours[screen.colour], screen)
}

const unregisterScreen = (screen) => {
	deleteLinkFromList(colours[screen.colour], screen)
}

const redrawScreen = (context, screen) => {
	clearScreen(context, screen)
	drawScreen(context, screen)
}

const clearScreen = (context, screen) => {
	
	context.beginPath()
	const {x, y, width, height} = screen
	context.rect(x, y, width, height)
	context.fillStyle = Colour.Black
	context.fill()
}

const drawScreen = (context, screen) => {

	context.beginPath()
	const {x, y, width, height} = screen
	context.rect(x, y, width, height)

	const innerWidth = width - BORDER_THICKNESS*2
	const innerHeight = height - BORDER_THICKNESS*2
	const innerX = x + BORDER_THICKNESS
	const innerY = y + BORDER_THICKNESS
	context.rect(innerX, innerY, innerWidth, innerHeight)

	context.fillStyle = Colour.splash(screen.colour)
	context.fill("evenodd")

}

//======//
// HAND //
//======//
const HAND_FREE = (context) => {
	
	if (Mouse.Left) {
		const [x, y] = Mouse.position

		const screen = makeScreen({
			colour: hand.colour,
			x,
			y,
			width: 10,
			height: 10,
		})

		registerScreen(screen)
		redrawScreen(context, screen)

		hand.screen = screen
		hand.startX = x
		hand.startY = y

		return HAND_DRAWING
	}

	return HAND_FREE
}

const HAND_DRAWING = (context) => {
	if (!Mouse.Left) {
		return HAND_FREE
	}

	const [x, y] = Mouse.position

	const dx = x - hand.startX
	const dy = y - hand.startY

	hand.screen.width = dx
	hand.screen.height = dy
	
	redrawScreen(context, hand.screen)

	return HAND_DRAWING

}

const hand = {
	state: HAND_FREE,
}

const updateHand = (context) => {
	hand.state = hand.state(context)
}

//======//
// Show //
//======//
const show = Show.start()

show.tick = (context) => {

	updateHand(context)

}

//=======//
// DEBUG //
//=======//
const screeno = makeScreen()
registerScreen(screeno)
