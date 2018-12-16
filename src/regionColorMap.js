let mapLegendColormap = d3.schemeCategory10;
let regions = [
    "Asia",
    "North America",
    "Europe",
    "Africa",
    "South America",
    "Oceania",
    "Australia",
    "Antarctica" 
];

const regionColorMap = new Map(regions.map((reg, i) => [reg, mapLegendColormap[i]]));
