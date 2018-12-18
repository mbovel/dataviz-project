async function init() {
	const dataSource = await DataSource.init();
	const graphPlot = new GraphPlot(document.getElementById("plot"));
	const sidebar = new Sidebar(document.getElementById("sidebar"), graphPlot, dataSource);
}

init().catch(console.error);
