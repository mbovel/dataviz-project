/*
    Run the action when we are sure the DOM has been loaded
    https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
    Example:
    whenDocumentLoaded(() => {
        console.log('loaded!');
        document.getElementById('some-element');
    });
*/
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}


function loadEventmentions(filename){
    return d3.csv(filename,
        function(d) {
            d.source = d.MentionSourceName;
            d.target = d.GLOBALEVENTID;
            d.Confidence = parseFloat(d.Confidence);
            d.id = d.source + d.target;
            let elem = {data: d};
            return elem
    });
}

function extractNodes(data){
    node_set = new Set(Array.from(data, d => d.data.source));
    nodes = Array.from(node_set, x => ({data: {id:x}, classes: 'source'}));
    node_set = new Set(Array.from(data, d => d.data.target));
    nodes = nodes.concat(Array.from(node_set, x => ({data: {id:x}, classes: 'event'})));
    nodes = nodes.concat(data);
    return nodes
}


function parseColor(input) {
	var m;
    m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if( m) {
        return '#' + [m[1],m[2],m[3]].map((d) => parseInt(parseInt(d)/16).toString(16)).join('');
    }
}

let tmpScale = d3.scalePow()
    .exponent(0.3)
    .domain([-10, 10])
    .range([1, 0]);
var toneScale = (d) => parseColor(d3.interpolateRdBu(tmpScale(d)));

var plotID = 'plot';
var cy = cytoscape({
  container: document.getElementById(plotID),
  style: cytoscape.stylesheet()
    .selector('node.source').style({
          'background-color': 'yellow',
          'width': 1,
          'height': 1,
    })
    .selector('node.event').style({
          'background-color': 'Lime',
          'width': 2,
          'height': 2,
    })
    .selector('edge').style({
          'width': 0.1,
		  //'line-color': 'mapData(MentionDocTone,-10,10,blue,red)',
		  'line-color': function (d) {return toneScale(d.json().data.MentionDocTone)},
          'opacity': function (d) {return d.json().data.Confidence / 100;}
    }),

});

var layoutparams = {
                  name: 'cose',
                  animate: true,
                  randomize: true,
                  animationDuration: 1500,
                  refresh: 1,
                  animationThreshold: 2,
                  fit: true,
                };

whenDocumentLoaded(() => {

    // prepare the data here
    filename = "eventmentions_20181119_1_filtered2.csv";
    loadEventmentions(filename)
        .then(function(data){
            data = extractNodes(data);
            cy.add(data);
            let layout = cy.layout(layoutparams);
            layout.run();
    });
});

