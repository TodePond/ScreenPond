//=======//
// SETUP //
//=======//

// Create default screens!
// TODO: move this
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
// MAIN //
//======//
const show = Show.start()
show.tick = (context) => {

	fireHandEvent(context, global.hand, "tick")

	for (const source of global.sources) {
		drawSource(context, source)
	}

}
