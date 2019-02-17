function plot_skills(skills) {
  data_skills = skills[0];

  // Remove and renew the test dropper
  document.getElementById("test_dropper").remove()
  var iDiv = document.createElement("div");
  iDiv.id = "test_dropper";
  iDiv.className = "dropper";
  document.getElementById("interaction").appendChild(iDiv);
  document.getElementById("test_dropper").style.height = "10%"

  // Remove and renow the skills dropper
  var skills = document.createElement("div");
  skills.id = "skills_temporary";
  skills.className = "dropper";
  document.getElementById("skills").insertAdjacentHTML('afterend', skills.outerHTML);
  document.getElementById("skills").remove()
  document.getElementById("skills_temporary").setAttribute("id", "skills")

  // Fill the skill
  d3.select("#skills").selectAll("text")
    .data(data_skills)
    .enter()
    .append("div") // To drag and drop
    .attr("class", "draggable") // To drag and drop
    .attr("draggable", "true") // To drag and drop
    .append("text")
    .text(function(d) {
      return d["Name"]
    })

  // Setup the drag and drop environment
  drag_and_drop()
}