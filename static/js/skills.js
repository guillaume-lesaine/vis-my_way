function plot_skills(skills) {
  data_skills = skills[0]
  d3.select("#footer").selectAll("text")
    .data(data_skills)
    .enter()
    .append("text")
    .text(function(d) {
      return d["Name"] + ' / '
    })
}