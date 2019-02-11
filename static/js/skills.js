//Récupération des données
d3.csv("data/Data_L/Skills.csv", function(raw) {
  raw.forEach(function(d, i) {
    d.name = d['Name'];
  })
  var data_skills = raw;
  //console.log(data_profile)

  plot_skills(data_skills)
})


function plot_skills(data_skills) {

d3.select("#footer").selectAll("text")
    .data(data_skills)
    .enter()
    .append("text")
    .text(function(d) {
      return d.name + ' / '
    })
}