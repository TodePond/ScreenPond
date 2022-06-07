//==========//
// KEYBOARD //
//==========//
const KEYDOWN = {}
on.keydown(e => {
	const {key} = e
	const event = KEYDOWN[key]
	if (event === undefined) return
	event(e)
})

export const onkeydown = (key, func) => KEYDOWN[key] = func