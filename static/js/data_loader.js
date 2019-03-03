// Initialization of the buttons, the input (real_file_button) and the displayed (load_data_button)
const real_file_button = document.getElementById("real_file_button")
const load_data_button = document.getElementById("load_data_button")

// The input to load the data is hidden. A click on the load data button triggers the input
// by simulating a click
load_data_button.addEventListener("click", function() {
  real_file_button.click()
})

// Object storing the user's data.
// It will be initialize in the future with the a vitrine resume
data_store_onfileload = {
  "Connections.csv": [],
  "Education.csv": [],
  "Languages.csv": [],
  "Positions.csv": [],
  "Profile.csv": [],
  "Projects.csv": [],
  "Skills.csv": [],
  "Test Scores.csv": []
}

// Array storing each method to be applied and the relative files to apply the
// method on.
method_store = [{
  "method": plot_header,
  "files": ["Profile.csv"]
}, {
  "method": plot_skills,
  "files": ["Skills.csv"]
}, {
  "method": plot_languages,
  "files": ["Languages.csv"]
}, {
  "method": plot_test_scores,
  "files": ["Test Scores.csv"]
}, {
  "method": plot_activities,
  "files": ["Education.csv"]
}, {
  "method": plot_core,
  "files": ["Education.csv", "Positions.csv", "Projects.csv", "Connections.csv"]
}, {
  "method": drag_and_drop, //The drag and drop activation is conducted once everything else has been generated
  "files": [] // Do not apply the drag and drop activation to the text boxes
}]

// We store in a list the files that need additional processing using custom regex
files_additional_treatment = ["Account Status History.csv", "Endorsement Received Info.csv"]

// Event listener allowing to detect loading of page
document.addEventListener("DOMContentLoaded", function() {
  updateHeight()
  read_initial()
});

// Function to keep the size of the export zone as a A4 format
function updateHeight() {
  var div_export = $('#export');
  var div_interaction = $('#interaction');
  var width = div_export.width();

  div_export.css('height', width * 1.414);
  div_interaction.css('height', width * 1.414);
}

// Event listener updating the height of the export and interaction zones on resize
window.addEventListener("resize", function() {
  updateHeight()
});

// Function to setup the page importing data from the server
function read_initial() {
  var keys_dict = Object.keys(data_store_onfileload);
  for (var i = 0; i < keys_dict.length; i++) {
    if (files_additional_treatment.indexOf(keys_dict[i]) > -1) {} else {
      $.ajax({
        type: "GET",
        async: false,
        url: "./data/Data_example/" + keys_dict[i],
        success: function(file_content) {
          data_store_onfileload[keys_dict[i]] = $.csv.toObjects(file_content)
          if (i === keys_dict.length-1) { // If all files have been imported
            execute_methods(data_store_onfileload)
          }
        }
      })
    }
  }
}

// Function to load new data from the interface
function read_onload(files) {
  var existing_files = []; // Initialize the potential missing files with full data_store_onfileload
  var c = 0;
  var f = 0;
  var keys_dict = Object.keys(data_store_onfileload)
  for (var i = 0; i < files.length; i++) {
    (function(file) {
      console.log(file.name)
      var name = file.name;
      var reader = new FileReader(); // Use of the FileReader tool
      reader.onload = function(e) {
        // Check if the name of the file is in the list of the files to process more
        if (keys_dict.indexOf(name) > -1) {
          // If parse the csv
          data_store_onfileload[name] = $.csv.toObjects(e.target.result);
          c += 1
          existing_files.push(name)
        } else {
          // Ignore the file
        }
        f += 1
        console.log(f)
        if (f === files.length) { //If all the files have been looked at
          if (c === keys_dict.length) { //If all the necessary files have been loaded
            execute_methods(data_store_onfileload)
            console.log(existing_files)
          } else {
            var diff = $(keys_dict).not(existing_files).get();
            console.log(diff)
            $('#load_fail_information').empty()
            $('#load_fail_information').append("<b>"+diff.join(", ")+"</b");
            $('#loadErrorModal').modal("show")
          }
        }
      }
      reader.readAsText(file, "UTF-8");
    })(files[i]);
  };
}

// Function to execute for each object from method_store, the method on the files
// The function is executed on load of the page and on load of new data
function execute_methods(data_store) {
  for (var i = 0; i < method_store.length; i++) {
    data = method_store[i].files.map(function(d) {
      return data_store[d]
    })
    method_store[i].method(data)
  }
}
