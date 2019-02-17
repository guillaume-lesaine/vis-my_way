var html2canvas = require("html2canvas");
var canvg = require("canvg");
var jsPDF = require("jspdf");

$("#export_resume_button").click(function() {

  // Activate a canvas for contacts
  var chart_connections_div = document.getElementById("contacts")
  var chart_connections_svg = document.getElementById("svg_connections")
  var chart_connections_canvas = document.getElementById("canvas_contacts")
  var chart_connections_style = {
    "width": window.getComputedStyle(chart_connections_div).getPropertyValue('width'),
    "height": window.getComputedStyle(chart_connections_div).getPropertyValue('height')
  }
  chart_connections_canvas.removeAttribute("hidden");
  chart_connections_canvas.setAttribute("width", chart_connections_style.width)
  chart_connections_canvas.setAttribute("height", chart_connections_style.height)
  chart_connections_div.setAttribute("hidden", "hidden")
  var chart_connections_string = canvg(document.getElementById('canvas_contacts'), chart_connections_svg.outerHTML)
  console.log(chart_connections_style)

  // Activate a canvas for timeline
  var chart_timeline_graph_div = document.getElementById("timeline_graph")
  var chart_timeline_graph_svg = document.getElementById("svg_timeline_graph")
  var chart_timeline_graph_canvas = document.getElementById("canvas_timeline_graph")
  var chart_timeline_graph_style = {
    "width": window.getComputedStyle(chart_timeline_graph_div).getPropertyValue('width'),
    "height": window.getComputedStyle(chart_timeline_graph_div).getPropertyValue('height')
  }
  chart_timeline_graph_canvas.removeAttribute("hidden");
  chart_timeline_graph_canvas.setAttribute("width", chart_timeline_graph_style.width)
  chart_timeline_graph_canvas.setAttribute("height", chart_timeline_graph_style.height)
  chart_timeline_graph_div.setAttribute("hidden", "hidden")
  var chart_timeline_graph_string = canvg(document.getElementById('canvas_timeline_graph'), chart_timeline_graph_svg.outerHTML)
  console.log(chart_timeline_graph_style)

  // Turn the #export div to a canvas
  html2canvas(document.getElementById("export")).then(function(canvas) {
    canvas.setAttribute("hidden", "hidden")
    canvas.setAttribute("id", "export_canvas")
    document.getElementById("export").appendChild(canvas);
    // Go back to the original state before download
    chart_connections_canvas.setAttribute("hidden", "hidden");
    chart_connections_div.removeAttribute("hidden")
    chart_timeline_graph_canvas.setAttribute("hidden", "hidden");
    chart_timeline_graph_div.removeAttribute("hidden")

    // Generate the pdf from a jpeg image
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF("p", "mm", "a4");
    var pdf_width = pdf.internal.pageSize.getWidth();
    var pdf_height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdf_width, pdf_height);
    pdf.save("my_way_resume.pdf");
  });

});