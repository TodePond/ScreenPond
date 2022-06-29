//======//
// LIST //
//======//
export class LinkedList {
	constructor(iterable = []) {
		this.start = undefined
		this.end = undefined
		this.isEmpty = true

		for (const item of iterable) {
			this.push(item)
		}
	}
	
	*[Symbol.iterator]() {
		let link = this.start
		while (link !== undefined) {
			yield link
			link = link.next
		}
	}

	push(item) {
		const link = makeLink(item)
		if (this.isEmpty) {
			this.start = link
			this.end = link
			this.isEmpty = false
		} else {
			this.end.next = link
			link.previous = this.end
			this.end = link
		}
	}

	pop() {
		
		if (this.isEmpty) {
			return undefined
		}

		const item = this.start.item
		if (this.start === this.end) {
			this.clear()
			return item
		}

		this.end = this.end.previous
		this.end.next = undefined
		return item
	}

	shift() {

		if (this.isEmpty) {
			return undefined
		}

		const item = this.start.item
		if (this.start === this.end) {
			this.clear()
			return item
		}

		this.start = this.start.next
		this.start.previous = undefined
		return item
	}

	clear() {
		this.start = undefined
		this.end = undefined
		this.isEmpty = true
	}

	setStart(link) {
		this.start = link
		link.previous = undefined
	}

}

const makeLink = (item) => {
	const previous = undefined
	const next = undefined
	const link = {item, previous, next}
	return link
}
