function plot_languages(languages) {
  data_languages = languages[0];

  // // Remove and renew the test dropper
  // document.getElementById("test_dropper").remove()
  // var iDiv = document.createElement("div");
  // iDiv.id = "test_dropper";
  // iDiv.className = "dropper";
  // document.getElementById("interaction").appendChild(iDiv);
  // document.getElementById("test_dropper").style.height = "10%"
  //
  // Remove and renew the skills dropper
  
  var languages = document.createElement("div");
  languages.id = "languages_temporary";
  languages.className = "dropper";
  document.getElementById("languages").insertAdjacentHTML('afterend', languages.outerHTML);
  document.getElementById("languages").remove();
  document.getElementById("languages_temporary").setAttribute("id", "languages");

  // Fill the languages
  d3.select("#languages").selectAll("text")
    .data(data_languages)
    .enter()
    .append("div") // To drag and drop
    .attr("class", "draggable") // To drag and drop
    .attr("draggable", "true") // To drag and drop
    .append("text")
    .text(function(d) {
      return (d["Name"] + ": " + d["Proficiency"]);
    })
}