var parseDate_education = d3.timeParse("%Y");

//Récupération des données Education
d3.csv("data/Data_L/Education.csv",function(raw){
	raw.forEach(function(d,i) {
		d.school_name = d['School Name'];
		d.start_date = parseDate_education(d['Start Date']);
		d.end_date = parseDate_education(d['End Date']);
		d.note = d['Notes'];
	})
	var data_education = raw;
	
	plot_education(data_education)
})

function plot_education(data) {
// Creation du svg

// Margin setup
var margin = {top: 5, right: 5, bottom: 5, left: 5};

var width = document.getElementById("education").offsetWidth - margin.left - margin.right;
var height = document.getElementById("education").offsetHeight - margin.top - margin.bottom;
	
var svg = d3.select("#education").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append('g')
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
//Echelle de couleur
var color = d3.scaleOrdinal(d3.schemeCategory20)

//Creation des echelles

//echelle verticale y
var yScale = d3.scaleTime()
	.domain([d3.min(data, function(d) {return d.start_date}),d3.max(data, function(d) {return d.end_date})])
	.range([height,0]);

//echelle x
var xScale = d3.scaleBand()
	.domain(data.map(function(d,i) {return i}))
	.rangeRound([0,width])
	.paddingInner(0.1);


//tooltip
var tooltip = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');


svg.append('g').selectAll("rect")
	.data(data)
	.enter()
		.append("rect")
			.attr("x", function(d,i){return xScale(i);})
			.attr("y",function(d){return yScale(d.end_date);})
			.attr("height",function(d){
				console.log(d.start_date);
				return yScale((d.start_date)-yScale(d.end_date));
			})
			.attr("width", function(d,i){return xScale.bandwidth();})
			.attr("fill", color(1))
			.attr('stroke', 'none')
			.on('mousemove', function(d) {
				var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
				tooltip
					.attr('style', 
						'left:' + (mouse[0] + 120 ) +'px;'+
						'top:' + (mouse[1] + 5 ) + 'px;'+
						'position: absolute;'+
						'color: #222;'+
						'background-color: #fff;'+
						'padding: .5em;'+
						'text-shadow: #f5f5f5 0 1px 0;'+
						'border-radius: 2px;'+
						'opacity: 0.9'
						)
					.html(d.key + ': ' + d.value);
				d3.selectAll('rect')
				.attr("opacity", function(e) {
					if (e===d) {
						return 1
					} else {
						return 0.4
					}
				});		
			})
			.on('mouseout', function() {
				tooltip.attr('style','display: none');
				d3.selectAll('rect')
				.attr("opacity", 1);
            })

}