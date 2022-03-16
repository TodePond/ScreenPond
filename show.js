const Show = {}

{

	Show.start = ({canvas, context, paused = false, scale = 1.0, aspect, speed = 1.0, resize = () => {}, tick = () => {}, supertick = () => {}} = {}) => {
		
		const show = {canvas, context, paused, scale, speed, resize, tick, supertick}

		if (document.body === null) {
			addEventListener("load", () => start(show))
		} else {
			start(show)
		}
		
		return show
	}

	const start = (show) => {
		
		// TODO: support canvases of different sizes. just for provided ones? or all?
		if (show.canvas === undefined) {
			document.body.style["margin"] = "0px"
			document.body.style["overflow"] = "hidden"
			document.body.style["background-color"] = Colour.Void

			show.canvas = document.createElement("canvas")
			show.canvas.style["background-color"] = Colour.Void
			show.canvas.style["image-rendering"] = "pixelated"
			document.body.appendChild(show.canvas)
		}

		if (show.context === undefined) {
			show.context = show.canvas.getContext("2d")
		}
		
		const resize = () => {

			const size = Math.min(innerWidth, innerHeight)
			const margin = `${(100 - show.scale*100)/2}` + (innerWidth > innerHeight? "vh" : "vw")

			show.canvas.width = Math.round(size * show.scale)
			show.canvas.height = Math.round(size * show.scale)
			show.canvas.style["width"] = show.canvas.width
			show.canvas.style["height"] = show.canvas.height
			
			show.canvas.style["margin-top"] = margin
			show.canvas.style["margin-bottom"] = margin
			show.canvas.style["margin-left"] = margin
			show.canvas.style["margin-right"] = margin
			
			show.resize(show.context, show.canvas)
		}

		let t = 0
		const tick = () => {

			t += show.speed
			while (t > 0) {
				if (!show.paused) show.tick(show.context, show.canvas)
				show.supertick(show.context, show.canvas)
				t--
			}
			
			requestAnimationFrame(tick)
		}


		addEventListener("resize", resize)
		addEventListener("keydown", (e) => {
			if (e.key === " ") show.paused = !show.paused
		})
		
		resize()
		requestAnimationFrame(tick)
		
	}

}