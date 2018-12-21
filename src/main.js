async function init() {
    M.AutoInit(document.body);

    const dataSource = await DataSource.init();
    const model = new Model(dataSource);

    const personsRanking = new PersonsRanking(
        document.querySelector("#persons-ranking-svg"),
        model
    );
    const timeSlider = new TimeSlider(
        document.querySelector("#time-slider"),
        document.querySelector("#granularity-select"),
        model
    );
    const timeDisplayer = new TimeDisplayer(document.querySelector("#time-display"), model);
    const barChart = new BarChart(document.querySelector("#bar-chart-svg"), model);
    const regionSelector = new RegionSelector(document.querySelector("#region-selector"), model);
    const toneButton = new SortToneButton(document.querySelector("#sort-tone"), model);
    const nameButton = new SortNameButton(document.querySelector("#sort-name"), model);

    model.register(personsRanking);
    model.register(barChart);
    model.register(timeSlider);
    model.register(timeDisplayer);
    model.register(regionSelector);
    model.register(toneButton);
    model.register(nameButton);
    model.init().catch(console.error);
}

init().catch(console.error);
