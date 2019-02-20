function plot_activities(activities) {
  data_activities = activities[0];
  
  // // Remove and renew the test dropper
  // document.getElementById("test_dropper").remove()
  // var iDiv = document.createElement("div");
  // iDiv.id = "test_dropper";
  // iDiv.className = "dropper";
  // document.getElementById("interaction").appendChild(iDiv);
  // document.getElementById("test_dropper").style.height = "10%"
  //
  // Remove and renew the dropper
  var activities = document.createElement("div");
  activities.id = "activities_temporary";
  activities.className = "dropper";
  document.getElementById("activities").insertAdjacentHTML('afterend', activities.outerHTML);
  document.getElementById("activities").remove()
  document.getElementById("activities_temporary").setAttribute("id", "activities")

  // Fill the activities
  d3.select("#activities").selectAll("text")
    .data(data_activities)
    .enter()
    .append("div") // To drag and drop
    .attr("class", "draggable") // To drag and drop
    .attr("draggable", "true") // To drag and drop
	.classed('hidden',function(d) {
		return d.Activities.length === 0
	})
    .append("text")
    .text(function(d) {
      return d["Activities"]
    })

}