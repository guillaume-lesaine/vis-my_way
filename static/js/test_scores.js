function plot_test_scores(test_scores) {
  data_test_scores = test_scores[0];

  // // Remove and renew the test dropper
  // document.getElementById("test_dropper").remove()
  // var iDiv = document.createElement("div");
  // iDiv.id = "test_dropper";
  // iDiv.className = "dropper";
  // document.getElementById("interaction").appendChild(iDiv);
  // document.getElementById("test_dropper").style.height = "10%"
  //
  // Remove and renew the skills dropper
  var test_scores = document.createElement("div");
  test_scores.id = "test_scores_temporary";
  test_scores.className = "dropper";
  document.getElementById("test_scores").insertAdjacentHTML('afterend', test_scores.outerHTML);
  document.getElementById("test_scores").remove()
  document.getElementById("test_scores_temporary").setAttribute("id", "test_scores")

  // Fill the test scores
  d3.select("#test_scores").selectAll("text")
    .data(data_test_scores)
    .enter()
    .append("div") // To drag and drop
    .attr("class", "draggable") // To drag and drop
    .attr("draggable", "true") // To drag and drop
    .append("text")
    .text(function(d) {
      return (d["Name"] + ": " + d["Score"]);
    })
}