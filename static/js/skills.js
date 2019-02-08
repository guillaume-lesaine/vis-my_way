//Récupération des données
d3.csv("data/Data_L/Profile.csv", function(raw) {
  raw.forEach(function(d, i) {
    d.first_name = d['First Name'];
    d.last_name = d['Last Name'];
    d.headline = d.Headline;
    d.adress = d['Geo Location'];
    d.summary = d.Summary;
  })
  var data_profile = raw;
  //console.log(data_profile)

  plot_profile(data_profile)
})

var j = {
  "x": 1
}

function plot_profile(data_profile) {

  last_name = d3.select("#name").selectAll("text")
    .data(data_profile)
    .enter()
    .append("text")
    .text(function(d) {
      //console.log(d);
      return d.first_name + ' ' + d.last_name
    })
  headline = d3.select("#headline").selectAll("text")
    .data(data_profile)
    .enter()
    .append("text")
    .text(function(d) {
      return d.headline
    })
  adress = d3.select("#contact").selectAll("text")
    .data(data_profile)
    .enter()
    .append("text")
    .text(function(d) {
      return d.adress
    })
  description = d3.select("#description").selectAll("text")
    .data(data_profile)
    .enter()
    .append("text")
    .text(function(d) {
      return d.summary
    })
}