const graphPlot = new GraphPlot(document.getElementById("plot"));
const sidebar = new Sidebar(document.getElementById("sidebar"), graphPlot);

async function init() {
	const data = await getData(2018, 12, 11);
	graphPlot.updateData(data);
}

init().catch(console.error);
