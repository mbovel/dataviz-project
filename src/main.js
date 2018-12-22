async function init() {
	M.AutoInit(document.body);
	const dataSource = await DataSource.init();
	const model = new Model(dataSource);
	const components = [
		new PersonsRanking(document.querySelector("#persons-ranking-svg"), model),
		new TimeSlider(document.querySelector("#time-slider-container"), model),
		new AttrSelect(document.querySelector("#freq-select"), model, "freq"),
		new BarChart(document.querySelector("#bar-chart-svg"), model),
		new AttrSelect(document.querySelector("#region-select"), model, "region"),
		new AttrSelect(document.querySelector("#sort-by-select"), model, "sortBy")
	];

	for (const component of components) {
		model.register(component);
	}

	model.setOptions({
		date: dataSource.minDate,
		minDate: dataSource.minDate,
		maxDate: dataSource.maxDate,
		freq: "M",
		sortBy: "name",
		selectedPerson: null,
		region: "swiss"
	});
}

whenDocumentLoaded(() => runPromise(init()));
