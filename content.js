chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'fillTextField') {
    // URL of the published Google Sheet in CSV format
    var sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHFNXA46QLRU8oBozMT-4TfL2qASDUJuBmtbK4V6-oEYjbOxktPJWwuXubHTNU1GrikWwKrJUeu01l/pub?gid=0&single=true&output=csv';

    fetch(sheetUrl)
      .then(response => response.text())
      .then(data => {
        // Process the CSV data as needed
        var rows = data.split('\n');
        var values = rows.map(row => row.split(','));

        // Create a mapping object for order numbers and tracking IDs
        var orderNumberToTrackingId = {};

        // Iterate over the rows and populate the mapping
        for (var i = 1; i < values.length; i++) { // Start from 1 to skip the header row
          var orderNumber = values[i][0].trim();
          var trackingId = values[i][1].trim();
          orderNumberToTrackingId[orderNumber] = trackingId;
        }

        console.log(values);

        // Find all anchor tags within divs with class "cell-body-title"
        var cellBodyTitles = document.querySelectorAll('.cell-body-title a');

        // Create a list to store the extracted texts without spaces
        var extractedTexts = [];

        // Iterate over each anchor tag and add non-empty texts without spaces to the list
        cellBodyTitles.forEach(function(anchor) {
          var text = anchor.textContent.trim();
          if (text) {
            // Replace spaces with an empty string and push to the array
            extractedTexts.push(text.replace(/\s/g, ''));
          }
        });

        // Find input fields with data-test-id "text-input-tracking-id"
        var inputFields = document.querySelectorAll('[data-test-id="text-input-tracking-id"]');

        if(extractedTexts.length === inputFields.length){
            for (var i = 0; i < extractedTexts.length; i++) { // Start from 1 to skip the header row
              var orderNumber = extractedTexts[i];
              if (orderNumber) {

                // Get the corresponding tracking ID from the mapping
                  var trackingId = orderNumberToTrackingId[orderNumber];

                  // Fill the input field with the tracking ID
                  inputFields[i].value = trackingId || ''; // Use an empty string if the tracking ID is not found
                  console.log(inputFields[i].value);
              }
            }
        }
      })
      .catch(error => {
        console.error('Error fetching spreadsheet data:', error);
      });
  }
});
