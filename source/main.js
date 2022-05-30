//========//
// GLOBAL //
//========//
const global = {
	screens: [],
	sources: {},
	multi: false,
	hand: {
		state: HAND_STATE.START,
		colour: Colour.Green.hex,
	},
}

//=======//
// SETUP //
//=======//
for (const i of (0).to(COLOURS.length-1)) {
	const colour = COLOURS[i]
	global.sources[colour] = {
		id: i+1,
		colour,
		corners: getDisplayCorners(i+1),
		screens: [],
	}
}

//======//
// SHOW //
//======//
const show = Show.start()
show.tick = (context) => {
	fireHandEvent(context, global.hand, "update")

	drawWorld(context, global.screens)

	for (const source of global.sources) {
		drawSource(context, source)
	}
}
