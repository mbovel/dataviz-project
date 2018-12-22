async function init() {
	M.AutoInit(document.body);
	const dataSource = await DataSource.init();
	const model = new Model(dataSource);
	const components = [
		new PersonsRanking(document.querySelector("#persons-ranking-svg"), model),
		new TimeSlider(document.querySelector("#time-slider"), model),
		new FreqSelect(document.querySelector("#freq-select"), model),
		new TimeDisplayer(document.querySelector("#time-display"), model),
		new BarChart(document.querySelector("#bar-chart-svg"), model),
		new RegionSelect(document.querySelector("#region-select"), model),
		new SortButton(document.querySelector("#sort-tone"), model, "tone"),
		new SortButton(document.querySelector("#sort-name"), model, "name")
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
