function resizeMapSVG() {
	let plotarea = document.getElementById("plotarea");
	let mapsvg = document.getElementById("map").querySelector("svg");
	mapsvg.style.width = plotarea.clientWidth * 0.3 + "px";
	mapsvg.style.height = plotarea.clientWidth * 0.2 + "px";
	//mapsvg.style.position = "absolute";
	//mapsvg.style.right = 0 + "px";
	mapsvg.style.transform = "translate3d(0px, 0px, 0px)";
}

function onEachFeature(feature, layer) {
	layer.on('click', function (e) {
	  console.log(feature.properties.CONTINENT);
	});
}

function makeMapLegend() {
	const map = L.map("map", { zoomControl: false, attributionControl: false });
	map.setView([60, 0], 1);
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

	Promise.all([d3.json("data/continents.json")]).then(([continents]) => {
		L.geoJSON(continents, {
			style: feature => ({
				color: "#0000",
				fillColor: regionColorMap.get(feature.properties.CONTINENT),
				weight: 1,
				opacity: 1,
				fillOpacity: 1
			}),
			onEachFeature: onEachFeature
		}).addTo(map);
		resizeMapSVG();
	});

	window.addEventListener("resize", resizeMapSVG);
}
