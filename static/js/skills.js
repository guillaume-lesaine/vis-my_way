function plot_skills(skills) {
  data_skills = skills[0];
  d3.select("#skills").selectAll("text").remove()
  d3.select("#skills").selectAll("text")
    .data(data_skills)
    .enter()
    .append("text")
    .text(function(d) {
      return d["Name"] + ' / '
    })
}