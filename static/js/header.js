var plot_header = function(header) {
  //Data preparation
  var data_header = header[0] //Only select the first row
  //Update of the header elements
  document.getElementById("name").innerHTML = data_header["First Name"] + ' ' + data_header["Last Name"];
  document.getElementById("headline").innerHTML = data_header["Headline"]
  document.getElementById("contact").innerHTML = data_header['Geo Location']
  document.getElementById("description").innerHTML = data_header['Summary']
}