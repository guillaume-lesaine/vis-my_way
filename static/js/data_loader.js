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
  "Phone Numbers.csv": [],
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
  "method": plot_connections,
  "files": ["Connections.csv"]
}, {
  "method": plot_skills,
  "files": ["Skills.csv"]
}, {
  "method": plot_timeline,
  "files": ["Education.csv", "Positions.csv", "Projects.csv"]
}]

// We store in a list the files that need additional processing using custom regex
files_additional_treatment = ["Account Status History.csv", "Endorsement Received Info.csv"]

// Event listener allowing to detect loading of page
document.addEventListener("DOMContentLoaded", function() {
  console.log("TOPTOPTOP");
  read_initial()
});

// Function to setup the page importing data from the server
function read_initial() {
  var keys_dict = Object.keys(data_store_onfileload);
  for (var i = 0; i < keys_dict.length; i++) {
    if (files_additional_treatment.indexOf(keys_dict[i]) > -1) {} else {
      $.ajax({
        type: "GET",
        async: false,
        url: "./data/Data_L/" + keys_dict[i],
        success: function(file_content) {
          data_store_onfileload[keys_dict[i]] = $.csv.toObjects(file_content)
          if (i === 8) {
            execute_methods(data_store_onfileload)
          }
        }
      })
    }
  }
}

// Function to load new data from the interface
function read_onload(files) {
  var c = 0
  for (var i = 0; i < files.length; i++) {
    (function(file) {
      var name = file.name;
      var reader = new FileReader(); // Use of the FileReader tool
      reader.onload = function(e) {
        // Check if the name of the file is in the list of the files to process more
        if (files_additional_treatment.indexOf(name) > -1) {
          // If so provide custom regex treatment
        } else {
          // Otherwise parse csv to object using JQUERY csv parse
          data_store_onfileload[name] = $.csv.toObjects(e.target.result);
          c += 1
          //console.log(data_store[name][0]) //data_store[name].data = $.csv.toObjects(e.target.result)
        }
        if (c === files.length) {
          execute_methods(data_store_onfileload)
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