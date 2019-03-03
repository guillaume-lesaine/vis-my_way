function plot_core(data_core) {
  data_education = data_core[0]
  data_positions = data_core[1]
  data_projects = data_core[2]
  //data_core[3] --> contacts

	//Echelle de couleur
  var color = d3.scaleOrdinal(d3.schemePaired)

  //###___timeline___###

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
    } else {
		if (d['Start Date'] === undefined) {
			d.start_date = parseDate_MY(d['Started On']);
			d.end_date = parseDate_MY(d['Finished On']);
		} else {
			d.start_date = parseDate_MY(d['Start Date']);
			d.end_date = parseDate_MY(d['End Date']);
		}
	}

  })
  console.log(data_timeline)
  plot_timeline(data_timeline,color);

  //###___contacts___###

  //Data preparations
  var parseDate = d3.timeParse("%d %b %Y"); //inverse de timeFormat
  var formatMY = d3.timeFormat("%b %Y"); //format month year

  data_core[3].forEach(function(d, i) {
    d['Connected On'] = parseDate(d['Connected On']);
    d.month_year = formatMY(d['Connected On']);
  })

  //Transformation des données
  var data_connections = d3.nest()
    .key(function(d) {
      return d.month_year
    })
    .rollup(function(v) {
      return v.length;
    })
    .entries(data_core[3]);

  plot_connections(data_connections,data_timeline,color);

}

function plot_timeline(data_timeline,color) {

  // Creation du svg graph

  d3.select("#svg_timeline_graph").remove();

  var width = document.getElementById("timeline_graph").offsetWidth // - margin.left - margin.right;
  var height = document.getElementById("timeline_graph").offsetHeight // - margin.top - margin.bottom;
  console.log("height",height)

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
    .attr("id",(d, i) => "rect_timeline_" + i )
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
		plot_timeline_text_refresh(data_timeline,color,yScale,state_array);
	})

	d3.select("#timeline_text")
	.on('drop', function() {
		plot_timeline_text_refresh(data_timeline,color,yScale,state_array);
	})

  document.getElementById("skills")
  .addEventListener('drop', function() {
    doit = setTimeout(function() {
      plot_timeline_text_refresh(data_timeline,color,yScale,state_array);
    }, 10);
  })


  window.addEventListener("resize", function() {
    plot_timeline_text_resize(data_timeline)
  });

	plot_timeline_text_load(data_timeline,color,yScale,state_array);

  // x = document.getElementById("timeline_graph")
  // v = x.style.top
  // console.log("0",v)
}


function plot_connections(data_connections,data_timeline,color) {
	d3.select("#svg_connections").remove();

	var formatY = d3.timeFormat("%Y"); //Used to display only years in ticks
	var parseDate_MY = d3.timeParse("%b %Y");
	var formatMY = d3.timeFormat("%b %Y");

  // Creation du svg
  var width = document.getElementById("connections").offsetWidth // - margin.left - margin.right;
  var height = document.getElementById("connections").offsetHeight // - margin.top - margin.bottom;

  // width = w1 + w2
  // w1 : width chart
  // w2 : width label zone
  var w1 = width * 0.65
  var w2 = width * 0.35

  var svg = d3.select("#connections").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .attr("id", "svg_connections")
    .append('g')
	.attr('transform','translate(5,2)')

  //Creation des echelles

  var domain_y = d3.timeMonth.range(d3.min(data_timeline, function(d) {
		return d.start_date
    }),d3.max(data_timeline, function(d) {
		return d.end_date
    }))

  //echelle verticale y
  var yScale = d3.scaleBand()
	.domain(domain_y.map(function(d) {return formatMY(d)}))
    .paddingInner(0.05)
    .range([height,0]);

  //echelle count x
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data_connections, function(d) {
      return d.value;
    })])
    .rangeRound([width - w2, 0]);

  //selectionner uniquement les mois de janvier
  var yAxisLabel = domain_y.map(function(d) {
    return formatMY(d)
  }).filter(
    function(d) {
      var words = d.split(' ');
      if (words[0] === 'Jan') {
        return d;
      }
    })

  var yAxis = d3.axisRight()
    .scale(yScale)
    .tickValues(yAxisLabel)
    .tickFormat(function(d) {
      return formatY(parseDate_MY(d))
    })
    .tickSizeInner(width/20)
    .tickSizeOuter(width/20)


  //Ajout de l'axe y
  svg.append('g')
    .attr('transform', 'translate(' + w1 + ',0)')
    .attr('id', 'y_axis')
    .style('color', 'black')
    .style("font-size",width/12)
    .attr("stroke-width",width/100)
    .call(yAxis);

	//Ajout d'une courbe
	var line = d3.line()
	.curve(d3.curveCardinal)
	.x(function(d) {return xScale(d.value);})
	.y(function(d) {return yScale(d.key) + yScale.bandwidth()/2;})

	svg.append('g').selectAll(".line")
	.data([data_connections])
	.enter()
		.append("path")
			.attr("class",function(d) {return line(d);})
			.attr("d",line)
			.attr("stroke", color(0))
			.attr("stroke-width",width/50)
			.attr("fill","none")

	//Ajout des cercles
	svg.append('g').selectAll("circle")
    .data(data_connections)
	.enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.value); })
    .attr("cy", function(d) { return yScale(d.key) + yScale.bandwidth()/2 ; })
    .attr("r", width/70)
}

function plot_timeline_text_load(data_timeline,color,yScale,state_array) {
	d3.select("#timeline_text").selectAll("div").remove();
	var formatMY = d3.timeFormat("%b %Y");
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
		  return formatMY(d.start_date) + " - " + formatMY(d.end_date) + "<br>" + d['Notes'];
      }
      if (d.type === "positions") {
		  return formatMY(d.start_date) + " - " + formatMY(d.end_date) + "<br>" + d['Description'];
      }
      if (d.type === "projects") {
		  return formatMY(d.start_date) + " - " + formatMY(d.end_date) + "<br>" + d['Description'];
      }
    });

  var skills_box = text_box.append("div") //skills_box
    .attr("class", "dropper hidden")
    .attr("id", function(d, i) {
      return "skills_box_" + i
    })
    .style("width", "98%");

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

  // Awesome icons management
  // Delete former icons
  d3.select("#connections_icons").selectAll("i").remove();
  d3.select("#timeline_icons").selectAll("i").remove();

  // Get the dv containing the icons
  var connections_icons = document.getElementById('connections_icons');
  var timeline_icons = document.getElementById('timeline_icons');

  // Now create and append to icons
  var connections = document.createElement('i');
  var education = document.createElement('i');
  var positions = document.createElement('i');
  var projects = document.createElement('i');

  // Create the icons
  connections.className = "fa fa-linkedin";
  connections.style.fontSize = "1.5vw";
  connections.style.display = "inline-block;";

  education.className = "fa fa-graduation-cap";
  education.style.fontSize = "1.6vw";
  // education.style.paddingLeft = "0.2vw";
  education.style.paddingRight = "0.2vw";
  positions.className = "fa fa-briefcase";
  positions.style.fontSize = "1.6vw";
  positions.style.paddingRight = "0.40vw";
  // positions.style.paddingRight = "0.2vw";
  projects.className = "fa fa-flag";
  projects.style.fontSize = "1.6vw";
  projects.style.paddingRight = "0.25vw";
  // projects.style.paddingLeft = "0.2vw";
  // projects.style.paddingRight = "0.2vw";

  connections_icons.appendChild(connections);
  timeline_icons.appendChild(education);
  timeline_icons.appendChild(positions);
  timeline_icons.appendChild(projects);

    // tooltip.classed('hidden', false)
    //   .attr('style', 'left:' + (mouse[0] + 20) +
    //       'px; top:' + (mouse[1] - 80 - height) + 'px')
    //   .html(function() {
    //     if (d.type === "education") {
    //     return d['School Name'];
    //     }
    //     if (d.type === "positions") {
    //     return d['Company Name'] + " - " + d['Title'];
    //     }
    //     if (d.type === "projects") {
    //     return d['Title']
    //     }
    //   });


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
  //drag_and_drop(true)
}

function plot_timeline_text_refresh(data_timeline,color,yScale,state_array) {
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

function plot_timeline_text_resize(data_timeline) {
  var height = document.getElementById("timeline_graph").offsetHeight
  var yScale = d3.scaleTime()
    .domain([d3.min(data_timeline, function(d) {
      return d.start_date
    }), d3.max(data_timeline, function(d) {
      return d.end_date
    })])
    .range([height, 0]);
  data_timeline.forEach(function(d,i) {
    x = document.getElementById("text_box_"+i)
    x.style.top = yScale(d.end_date)
  })
}
