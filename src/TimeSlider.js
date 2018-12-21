class TimeSlider {
	constructor(/**HTMLElement*/ container, /**HTMLElement*/ selectContainer, /**Model*/ model) {
		this.container = container;
		this.selectContainer = selectContainer;
		this.slider = container.querySelector("input[type=range]");
		this.selector = selectContainer.querySelector("select");
		this.model = model;
		this.minDate = null;

		this.slider.addEventListener("input", this.handleInput.bind(this));
		this.selectContainer.addEventListener("change", this.handleSelect.bind(this));
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

	handleSelect() {
		this.model.setFreq(this.selector.value).catch(console.error);
	}
}
