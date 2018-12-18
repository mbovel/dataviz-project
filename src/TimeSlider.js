class TimeSlider {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.container = container;
		this.slider = container.querySelector("input[type=range]");
		this.slider.addEventListener("input", this.handleInput.bind(this));
		this.model = model;
		this.minDate = null;
	}

	setState({ date, minDate, maxDate }) {
		this.minDate = minDate;
		this.slider.min = 0;
		this.slider.max = d3.timeDay.count(minDate, maxDate);
		this.slider.value = clamp(
			d3.timeDay.count(minDate, date),
			this.slider.min,
			this.slider.max
		);
	}

	handleInput() {
		this.model.setDate(d3.timeDay.offset(this.minDate, this.slider.value)).catch(console.error);
	}
}
