// //Récupération des données
// function load_data() {
//   //data education
//   d3.csv("data/Data_L/Education.csv", function(raw) {
//     raw.forEach(function(d, i) {
//       d.school_name = d['School Name'];
//       d.start_date = parseDate_Y(d['Start Date']);
//       d.end_date = parseDate_Y(d['End Date']);
//       d.note = d['Notes'];
//     })
//     data_education = raw;
//     //console.log(data_education)
//   })
//
//   //data positions
//   d3.csv("data/Data_L/Positions.csv", function(raw) {
//     raw.forEach(function(d, i) {
//       d.company = d['Company Name'];
//       d.title = d['Title'];
//       d.description = d['Description'];
//       d.loc_position = d['Location'];
//       d.start_date = parseDate_MY(d['Started On']);
//       d.end_date = parseDate_MY(d['Finished On']);
//     })
//     data_positions = raw;
//     //console.log(data_positions)
//   })
//   //data projects
//   d3.csv("data/Data_L/Projects.csv", function(raw) {
//     raw.forEach(function(d, i) {
//       d.title = d['Title'];
//       d.description = d['Description'];
//       d.start_date = parseDate_MY(d['Start Date']);
//       d.end_date = parseDate_MY(d['End Date']);
//     })
//     data_projects = raw;
//     //console.log(data_projects)
//   })
//   //console.log(data_education)
//   //plot_timeline(data_education, data_positions, data_projects)
// }

function plot_timeline(data_timeline) {
  data_education = data_timeline[0]
  data_positions = data_timeline[1]
  data_projects = data_timeline[2]

  var parseDate_Y = d3.timeParse("%Y");
  var parseDate_MY = d3.timeParse("%b %Y");

  //////              //////
  //     Data Parsing     //
  //////              //////

  // Creation du svg graph
  var margin = {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  };

  var width = document.getElementById("timeline_graph").offsetWidth - margin.left - margin.right;
  var height = document.getElementById("timeline_graph").offsetHeight - margin.top - margin.bottom;

  var svg = d3.select("#timeline_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Echelle de couleur
  var color = d3.scaleOrdinal(d3.schemeCategory10)

  //echelle verticale y
  var min_list = [];
  var max_list = [];
  console.log(data_education.map(function(d) {
    return d.start_date
  }))
  min_list.push(d3.min(data_education, function(d) {
    return d.start_date
  }));
  min_list.push(d3.min(data_positions, function(d) {
    return d.start_date
  }));
  min_list.push(d3.min(data_projects, function(d) {
    return d.start_date
  }));

  max_list.push(d3.max(data_education, function(d) {
    return d.end_date
  }));
  max_list.push(d3.max(data_positions, function(d) {
    return d.end_date
  }));
  max_list.push(d3.max(data_projects, function(d) {
    return d.end_date
  }));

  var yScale = d3.scaleTime()
    .domain([d3.min(min_list, function(d) {
      return d
    }), d3.max(max_list, function(d) {
      return d
    })])
    .range([height, 0]);

  //echelle x
  var xScale = d3.scaleBand()
    .domain([0, 1, 2])
    .rangeRound([0, width])
    .paddingInner(0.5);
  /*
  education = svg.append('g').selectAll("rect")
  	.data(data_education)
  	.enter()
  		.append("rect")
  			.attr("x", xScale(0))
  			.attr("y",function(d){return yScale(d.end_date);})
  			.attr("height",function(d){
  				console.log(d.start_date);
  				return yScale((d.start_date)-yScale(d.end_date));
  			})
  			.attr("width", function(d,i){return xScale.bandwidth();})
  			.attr("fill", color(1))
  			.attr('stroke', 'none')
  */
}

load_data()