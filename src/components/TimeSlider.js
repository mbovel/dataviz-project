const d3Intervals = {
	D: d3.timeDay,
	M: d3.timeMonth,
	Y: d3.timeYear
};

class TimeSlider {
	constructor(/**HTMLElement*/ sliderEl, /**Model*/ model) {
		this.sliderEl = sliderEl;
		this.model = model;
		this.minDate = null;
		this.interval = null;

		this.sliderEl.addEventListener("input", this.handleInput.bind(this));
	}

	setState({ options: { freq, date, minDate, maxDate } }) {
		this.interval = d3Intervals[freq];
		this.minDate = minDate;
		this.sliderEl.min = 0;
		this.sliderEl.max = this.interval.count(minDate, maxDate);
		this.sliderEl.value = clamp(
			this.interval.count(minDate, date),
			this.sliderEl.min,
			this.sliderEl.max
		);
	}

	handleInput() {
		const date = this.interval.offset(this.minDate, this.sliderEl.value);
		this.model.setOptions({ date });
	}
}
