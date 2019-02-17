var plot_connections = function(connections) {
  //Data preparations
  var parseDate = d3.timeParse("%d %b %Y"); //inverse de timeFormat
  var formatMY = d3.timeFormat("%b %Y"); //format month year
  connections[0].forEach(function(d, i) {
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
    .entries(connections[0]);

  d3.select("#svg_connections").remove();

  // Creation du svg

  // Margin setup svg
  // var margin = {
  //   top: 5,
  //   right: 60,
  //   bottom: 5,
  //   left: 0
  // };
  var width = document.getElementById("contacts").offsetWidth // - margin.left - margin.right;
  var height = document.getElementById("contacts").offsetHeight // - margin.top - margin.bottom;

  var svg = d3.select("#contacts").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    // .attr("width", width) // + margin.left + margin.right)
    // .attr("height", height) // + margin.top + margin.bottom)
    .attr("id", "svg_connections")
    .append('g')
  //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Echelle de couleur
  var color = d3.scaleOrdinal(d3.schemeCategory10)

  //Creation des echelles

  //echelle verticale y
  var yScale = d3.scaleBand()
    .domain(data_connections.map(function(d) {
      return d.key
    }))
    .paddingInner(0.05)
    .range([0, height]);

  //echelle count x
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data_connections, function(d) {
      return d.value;
    })])
    .rangeRound([width, 0]);

  //selectionner uniquement les mois de janvier
  var yAxisLabel = data_connections.map(function(d) {
    return d.key
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

  //Ajout de l'axe y
  svg.append('g')
    .attr('transform', 'translate(' + width + ',0)')
    .attr('class', 'y axis')
    .call(yAxis);

  //Ajout de l'axe count x
  /*svg.append('g')
  	.attr('transform','translate(0,' + height + ')')
  	.attr('class','x axis')
  	.call(d3.axisBottom().scale(xScale));
  */
  //tooltip
  // var tooltip = d3.select("#contacts").append('div')
  //   .attr('class', 'hidden tooltip');

  svg.append('g').selectAll("rect")
    .data(data_connections)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return xScale(d.value);
    })
    .attr("y", function(d, i) {
      return yScale(d.key);
    })
    .attr("height", function(d) {
      return yScale.bandwidth();
    })
    .attr("width", function(d, i) {
      return width - xScale(d.value);
    })
    .attr("fill", color(1))
    .attr('stroke', 'none')
  // .on('mousemove', function(d) {
  //   var mouse = d3.mouse(svg.node()).map(function(d) {
  //     return parseInt(d);
  //   });

  //   tooltip
  //     .attr('style',
  //       'position: relative;' +
  //       'left:' + (mouse[0] + 0) + 'px;' +
  //       'top:' + (mouse[1] - height) + 'px;' +
  //       'color: #222;' +
  //       'background-color: #fff;' +
  //       'padding: .5em;' +
  //       'text-shadow: #f5f5f5 0 1px 0;' +
  //       'border-radius: 2px;' +
  //       'opacity: 0.9;' +
  //       'width: 100px'
  //     )
  //     .html(d.key + ': ' + d.value);
  //   d3.selectAll('rect')
  //     .attr("opacity", function(e) {
  //       if (e === d) {
  //         return 1
  //       } else {
  //         return 0.4
  //       }
  //     });
  // })
  // .on('mouseout', function() {
  //   tooltip.attr('style', 'display: none');
  //   d3.selectAll('rect')
  //     .attr("opacity", 1);
  // })
}