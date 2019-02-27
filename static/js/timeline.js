function plot_timeline(data_timeline) {
  data_education = data_timeline[0]
  data_positions = data_timeline[1]
  data_projects = data_timeline[2]

  //Education: min 1 year
  data_education.forEach(function(d) {
    if (d['Start Date'] === d['End Date']) {
      d['End Date'] = String(Number(d['Start Date']) + 1)
    }
  })
  //Education --> sept
  data_education.forEach(function(d) {
    d['Start Date'] = "Sep " + d['Start Date'];
    d['End Date'] = "Sep " + d['End Date'];
  })

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

  //Data Parsing
  var parseDate_Y = d3.timeParse("%Y");
  var parseDate_MY = d3.timeParse("%b %Y");

  data_timeline.forEach(function(d) {
    if (d.type === "education") {
      d.start_date = parseDate_MY(d['Start Date']);
      d.end_date = parseDate_MY(d['End Date']);
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
  //sort
  function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return b.end_date - a.end_date;
  }
  data_timeline = data_timeline.sort(sortByDateAscending)

  //mise en forme du texte
  data_timeline.forEach(function(d) {
    if (d.type === "education") { //education
      d.Notes = d.Notes.replace(/ -/g, "<br> -")
    }
    if (d.type === "positions") { //positions
      d.Description = d.Description.replace(/ -/g, "<br> -")
    }
    if (d.type === "projects") { //projects
      d.Description = d.Description.replace(/ -/g, "<br> -")
    }
  })

  //Data Parsing
  data_timeline.forEach(function(d) {
    if (d.type === "education") {
      d.start_date = parseDate_MY(d['Start Date']);
      d.end_date = parseDate_MY(d['End Date']);
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

  d3.select("#svg_timeline_graph").remove();

  var width = document.getElementById("timeline_graph").offsetWidth // - margin.left - margin.right;
  var height = document.getElementById("timeline_graph").offsetHeight // - margin.top - margin.bottom;

  // width = w1 + w2
  // w1 : width timeline graph
  // w2 : width timeline text
  var w1 = width * 0.6
  var w2 = width * 0.4

  var svg = d3.select("#timeline_graph").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .attr("id", "svg_timeline_graph")
    .append('g')
	.attr("transform", "translate(" + width*0.05 + ", 0)");

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
    .rangeRound([0, 0.9*width])
    .paddingInner(0.3);

  //tooltip
  var tooltip = d3.select("#timeline_graph").append('div')
	.attr('class', 'hidden tooltip'); // hidden & tooltip

	//state array
	var state_array = []; //array of the state of each text_box (0,1,2,3)
	data_timeline.forEach(function(d) {
		state_array.push("1");
	})
	
  //rect
  svg.append('g').selectAll(".rect_timeline")
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
      return yScale(d.start_date) - yScale(d.end_date);
    })
    .attr("width", function(d, i) {
      return xScale.bandwidth();
    })
    .attr("fill", function(d, i) {
      return color(i);
    })
    //.attr('stroke', "black")
	.attr("class","rect_timeline")
	.on('mousemove', function(d) {
		var mouse = d3.mouse(svg.node()).map(function(d) {
		return parseInt(d);
		});
		tooltip.classed('hidden', false)
			.attr('style', 'left:' + (mouse[0] + 20) +
					'px; top:' + (mouse[1] - 80 - height) + 'px')
			.html(function() {
			  if (d.type === "education") {
				return d['School Name'];
			  }
			  if (d.type === "positions") {
				return d['Company Name'] + " - " + d['Title'];
			  }
			  if (d.type === "projects") {
				return d['Title']
			  }
			});
		d3.selectAll('.rect_timeline')
		   .attr("opacity", function(e) {
			 if (e === d) {
			   return 1
			 } else {
			   return 0.2
			 }
		   });
	   })

	.on('mouseout', function() {
		tooltip.classed('hidden', true);
		d3.selectAll('.rect_timeline')
		.attr("opacity", 1);
	})
	//click to display title subtitle skills_box --> change state array
	.on('click', function(d,i) {
		state_array[i] = String((Number(state_array[i])+1)%4);
		//console.log(state_array);
		plot_timeline_text(data_timeline,color,yScale,state_array);
	})
	
	d3.select("#timeline_text")
	.on('drop', function() {
		plot_timeline_text(data_timeline,color,yScale,state_array);
	
	})
	//d3.select(".text_box").remove();
	plot_timeline_text(data_timeline,color,yScale,state_array);
}

function plot_timeline_text(data_timeline,color,yScale,state_array) {
	d3.select("#svg_timeline_text").remove();
  //text
  var text_box = d3.select("#timeline_text").selectAll("div")
    .data(data_timeline)
    .enter()
    .append("div") //text_box
    .attr("id", (d, i) => "text_box_" + i)
    .attr("class", "text_box")
	.attr("state", function(d,i){ //0:rien 1:title 2:+subtitle 3:+skills_box
		return state_array[i];
	})
	.attr('style', function(d,i) {
		return "border-top: 5px solid " + color(i) + ";" +
		"position: absolute;" +
		"width: 100%;" +
		//"left: 0%;" +
		"top:" + yScale(d.end_date)
		+"px"
	})
	var title = text_box.append("div") //title
    .attr("class", "title")
    .attr("id", function(d, i) {
      return "title_" + i
    })
    .html(function(d) {
      if (d.type === "education") {
        return d['School Name'];
      }
      if (d.type === "positions") {
        return d['Company Name'] + " - " + d['Title'] + " - " + d['Location'];
      }
      if (d.type === "projects") {
        return d['Title'];
      }
    });

  var subtitle = text_box.append("div") //subtitle
    .attr("class", "subtitle hidden")
    .attr("id", function(d, i) {
      return "subtitle_" + i
    })
    .html(function(d) {
      if (d.type === "education") {
        return d['Notes'];
      }
      if (d.type === "positions") {
        return d['Description']
      }
      if (d.type === "projects") {
        return d['Description']
      }
    });

  var skills_box = text_box.append("div") //skills_box
    .attr("class", "dropper hidden")
    .attr("id", function(d, i) {
      return "skills_box_" + i
    })
    .style("min-height", "3vw")
	.style("width", "98%")
	//.on('change', plot_timeline_text(data_timeline,color,yScale,state_array));
	
	//hidden according to the state
	state_array.forEach(function(d,i) {
	//state = 0 nothing
	if (state_array[i]==='0') {
		d3.select('#text_box_' + i).classed('hidden',true);
		d3.select('#title_' + i).classed('hidden',true);
		d3.select('#subtitle_' + i).classed('hidden',true);
		d3.select('#skills_box_' + i).classed('hidden',true);
	}
	//state = 1 --> text_box + title
	else if (state_array[i]==='1') {
		d3.select('#text_box_' + i).classed('hidden',false);
		d3.select('#title_' + i).classed('hidden',false);
		d3.select('#subtitle_' + i).classed('hidden',true);
		d3.select('#skills_box_' + i).classed('hidden',true);
	}
	//state = 2 --> text_box + title + subtitle
	else if (state_array[i]==='2') {
		//d3.select('#text_box_' + i).classed('hidden',false);
		//d3.select('#title_' + i).classed('hidden',false);
		d3.select('#subtitle_' + i).classed('hidden',false);
		//d3.select('#skills_box_' + i).classed('hidden',true);

	}
	//state = 3 --> text_box + title + subtitle + skills_box
	else if (state_array[i]==='3') {
		d3.select('#text_box_' + i).classed('hidden',false);
		d3.select('#title_' + i).classed('hidden',false);
		d3.select('#subtitle_' + i).classed('hidden',false);
		d3.select('#skills_box_' + i).classed('hidden',false);
	}
	})
	

	//management of the layout 100% or 50%
	for (i = 1; i < data_timeline.length; i++) { //i=1,2,3,4,5,6,7
		if (yScale(data_timeline[i].end_date) < yScale(data_timeline[i-1].end_date) + d3.select('#text_box_' + String(Number(i) - 1)).node().getBoundingClientRect().height) {
			//console.log(i-1 + " deborde sur " + i);
			//console.log(yScale(data_timeline[i-1].end_date));
			//console.log(d3.select('#text_box_' + String(Number(i) - 1)).node().getBoundingClientRect().height);
			//console.log(" ");
			//texte_box i-1 --> 50% left
			d3.select("#text_box_"+ String(i-1))
				.attr("style",
				"border-top: 5px solid " + color(i-1) + ";" +
				"position: absolute;" +
				"width: 50%;" +
				//"left: 50%;" +
				"top:" + yScale(data_timeline[i-1].end_date) +"px"
				);
			//texte_box i --> 50% right
			d3.select("#text_box_"+i)
				.attr("style",
				"border-top: 5px solid " + color(i) + ";" +
				"position: absolute;" +
				"width: 50%;" +
				"left: 50%;" +
				"top:" + yScale(data_timeline[i].end_date) +"px"
				);
		}
		else {
			//console.log(i-1 + " ne deborde pas sur " + i)
			//console.log(" ");
			d3.select("#text_box_"+i)
				.attr("style",
				"border-top: 5px solid " + color(i) + ";" +
				"position: absolute;" +
				"width: 100%;" +
				//"left: 50%;" +
				"top:" + yScale(data_timeline[i].end_date) +"px"
				);
		}
		
	}
}