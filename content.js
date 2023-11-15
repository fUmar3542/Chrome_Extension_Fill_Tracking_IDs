// content.js

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'fillTextField') {
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

    // Print the list of extracted texts to the console
    console.log(extractedTexts);

    // Find input fields with data-test-id "text-input-tracking-id"
    var inputFields = document.querySelectorAll('[data-test-id="text-input-tracking-id"]');

    // Ensure there are equal numbers of anchor tags and input fields
    if (extractedTexts.length === inputFields.length) {
      // Iterate over each pair of extracted text and input field
      extractedTexts.forEach(function(text, index) {
        // Fill the corresponding input field with the extracted text
        inputFields[index].value = text;
      });
    } else {
      console.error('Mismatched number of anchor tags with text and input fields');
    }
  }
});
