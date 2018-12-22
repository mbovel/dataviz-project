const d3Interval = {
	D: d3.timeDay,
	M: d3.timeMonth,
	Y: d3.timeYear
};

const d3TimeFormater = {
	D: d3.timeFormat("%b %y"),
	M: d3.timeFormat("%b %y"),
	Y: d3.timeFormat("%Y")
};

const approxLabelWidth = {
	D: 90,
	M: 90,
	Y: 20
};

class TimeSlider {
	constructor(/**HTMLElement*/ containerEl, /**Model*/ model) {
		this.sliderEl = containerEl.querySelector("input[type=range]");
		this.ticksEl = containerEl.querySelector(".ticks");
		this.model = model;
		this.savedOptions = null;
		this.isDragging = false;

		this.sliderEl.addEventListener("input", this.handleInput.bind(this));
		this.sliderEl.addEventListener("mousedown", () => (this.isDragging = true));
		this.sliderEl.addEventListener("mouseup", () => (this.isDragging = false));
		window.addEventListener("resize", () => this.generateTicks(this.savedOptions));
	}

	setState({ options }) {
		this.savedOptions = options;
		// We don't update the slider value if the user is currently using it.
		if (!this.isDragging) this.updateSlider(options);
		this.generateTicks(options);
	}

	updateSlider({ freq, date, minDate, maxDate }) {
		const interval = d3Interval[freq];
		this.sliderEl.min = 0;
		this.sliderEl.max = interval.count(minDate, maxDate);
		this.sliderEl.value = clamp(
			interval.count(minDate, date),
			this.sliderEl.min,
			this.sliderEl.max
		);
	}

	generateTicks({ freq, date, minDate, maxDate }) {
		const interval = d3Interval[freq];
		const intervalCount = interval.count(minDate, maxDate);
		const maxTicksNumber = this.ticksEl.offsetWidth / approxLabelWidth[freq];
		const step = Math.max(Math.floor((intervalCount + 1) / maxTicksNumber), 1);
		const ticks = interval.range(minDate, maxDate, step);
		const tickWidth = (step / (intervalCount + step)) * 100;
		this.ticksEl.innerHTML = ticks
			.map(d => `<li style="width: ${tickWidth}%;">${d3TimeFormater[freq](d)}</li>`)
			.join("");
		this.sliderEl.setAttribute("style", `padding: 0 ${tickWidth / 2}%;`);
	}

	handleInput() {
		const { freq, minDate } = this.savedOptions;
		const date = d3Interval[freq].offset(minDate, this.sliderEl.value);
		this.model.setOptions({ date });
	}
}
