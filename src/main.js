async function init() {
	const dataSource = await DataSource.init();
	const model = new Model(dataSource);

	const personsRanking = new PersonsRanking(document.querySelector("#persons-ranking-svg"), model);
	const timeSlider = new TimeSlider(document.querySelector("#time-slider"), model);

	model.register(personsRanking);
	model.register(timeSlider);
	model.init().catch(console.error);
}

const tooltip = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);

init().catch(console.error);
