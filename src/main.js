async function init() {
	const dataSource = await DataSource.init();
	const model = new Model(dataSource);

	const personsRanking = new PersonsRanking(document.querySelector("#persons-ranking"), model);
	const timeSlider = new TimeSlider(document.querySelector("#time-slider"), model);

	model.register(personsRanking);
	model.register(timeSlider);
	model.init().catch(console.error);
}

init().catch(console.error);
