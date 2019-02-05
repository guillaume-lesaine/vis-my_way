// Initialization of the buttons, the input (real_file_button) and the displayed (load_data_button)
const real_file_button = document.getElementById("real_file_button")
const load_data_button = document.getElementById("load_data_button")

// The input to load the data is hidden. A click on the load data button triggers the input
// by simulating a click
load_data_button.addEventListener("click", function() {
  real_file_button.click()
})

// Object storing the user data.
// It will be initialize in the future with the a vitrine resume
data_store = {
  "Account Status History.csv": [],
  "Connections.csv": [],
  "Education.csv": [],
  "Endorsement Received Info.csv": [],
  "Languages.csv": [],
  "Phone Numbers.csv": [],
  "Positions.csv": [],
  "Profile.csv": [],
  "Projects.csv": [],
  "Skills.csv": [],
  "Test Scores.csv": []
}

// We store in a list the files that need additional processing using custom regex
files_additional_treatment = ["Account Status History.csv", "Endorsement Received Info.csv"]

// Read inputed files, parse and set the data in data_store
const input = document.querySelector('input[type="file"]')
input.addEventListener("change", function(e) {
  for (var i = 0; i < input.files.length; i++) {
    (function(file) {
      var name = file.name; // Name of the file
      var reader = new FileReader(); // Use of the FileReader tool
      reader.onload = function(e) {
        // Check if the name of the file is in the list of the files to process more
        if (files_additional_treatment.indexOf(name) > -1) {
          // If so provide custom regex treatment

        } else {
          // Otherwise parse csv to object using JQUERY csv parse
          data_store[name] = $.csv.toObjects(e.target.result)
        }
      }
      reader.readAsText(file, "UTF-8");
    })(input.files[i]);
  }
}, false)