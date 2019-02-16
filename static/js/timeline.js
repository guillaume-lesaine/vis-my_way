function plot_timeline(data_timeline) {
  data_education = data_timeline[0]
  data_positions = data_timeline[1]
  data_projects = data_timeline[2]

  //creation data_timeline
  var data_timeline = [];
  data_education.forEach(function(d) {
    d.type = "education";
    data_timeline.push(d);
  })
  data_positions.forEach(function(d) {
    d.type = "positions";
    data_timeline.push(d)
  })
  data_projects.forEach(function(d) {
    d.type = "projects";
    data_timeline.push(d)
  })

  var parseDate_Y = d3.timeParse("%Y");
  var parseDate_MY = d3.timeParse("%b %Y");

  //Data Parsing
  data_timeline.forEach(function(d) {
    if (d.type === "education") {
      d.start_date = parseDate_Y(d['Start Date']);
      d.end_date = parseDate_Y(d['End Date']);
      if (d.start_date.getTime() === d.end_date.getTime()) {
        d.end_date = d.end_date + parseDate_Y("1");
        //console.log(d.end_date);
      };
    }
    if (d.type === "positions") {
      d.start_date = parseDate_MY(d['Started On']);
      d.end_date = parseDate_MY(d['Finished On']);
    }
    if (d.type === "projects") {
      d.start_date = parseDate_MY(d['Start Date']);
      d.end_date = parseDate_MY(d['End Date']);
    }

  })

  // Creation du svg graph
  // var margin = {
  //   top: 5,
  //   right: 5,
  //   bottom: 5,
  //   left: 5
  // };

  var width = document.getElementById("timeline_graph").offsetWidth // - margin.left - margin.right;
  var height = document.getElementById("timeline_graph").offsetHeight // - margin.top - margin.bottom;

  var svg = d3.select("#timeline_graph").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .attr("id", "svg_timeline_graph")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append('g')
  //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Echelle de couleur
  var color = d3.scaleOrdinal(d3.schemePaired)

  //echelle verticale y
  var yScale = d3.scaleTime()
    .domain([d3.min(data_timeline, function(d) {
      return d.start_date
    }), d3.max(data_timeline, function(d) {
      return d.end_date
    })])
    .range([height, 0]);

  //echelle x
  var xScale = d3.scaleBand()
    .domain(["education", "positions", "projects"])
    .rangeRound([0, width])
    .paddingInner(0.5);

  //rect
  svg.append('g').selectAll("rect")
    .data(data_timeline)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xScale(d.type)
    })
    .attr("y", function(d) {
      return yScale(d.end_date);
    })
    .attr("height", function(d) {
      //console.log(yScale(d.end_date));
      return yScale(d.start_date) - yScale(d.end_date);
    })
    .attr("width", function(d, i) {
      return xScale.bandwidth();
    })
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr('stroke', "black")
  //text
  var text_box = d3.select("#timeline_text").selectAll("div")
    .data(data_timeline)
    .enter()
    .append("div")
    .attr("class", "text_box");
  text_box.append("div") //title
    .attr("class", "title")
    .text(function(d) {
      if (d.type === "education") {
        return d['School Name'];
      }
      if (d.type === "positions") {
        return d['Company Name'];
      }
    });
  text_box.append("div") //subtitle
    .attr("class", "subtitle")
    .text(function(d) {
      return d['Notes']
    });

}