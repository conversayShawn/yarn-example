const { getAccessibilityResults } = require('@cypress/extract-cloud-results');
const axios = require('axios');

getAccessibilityResults({
  projectId: process.env.CYPRESS_PROJECT_ID,
  recordKey: process.env.CYPRESS_RECORD_KEY,
  runTags: ["a11y"],
}).then((results) => {
  const { runNumber, accessibilityReportUrl, summary, rules } = results;
  const { total } = summary.violationCounts;

  console.log(`Received ${summary.isPartialReport ? "partial" : ""} results for run #${runNumber}.`);
  console.log(`See full report at ${accessibilityReportUrl}.`);

  if (total > 0) {
    const { critical, serious, moderate, minor } = summary.violationCounts;

    console.log(`${total} Accessibility violations were detected - ${critical} critical, ${serious} serious, ${moderate} moderate, and ${minor} minor.`);
    console.log("The following rules were violated:");
    console.log(rules);

    console.warn(`${total} Accessibility violations detected. Please review and address these issues.`);
  } else {
    console.log("No Accessibility violations detected!");
  }

  // Send data to Webhook.site for testing
  axios.post('https://webhook.site/64d67fc7-3bf0-4db4-83e8-f36d95373874', {
    runNumber,
    accessibilityReportUrl,
    total,
    violations: summary.violationCounts,
    rules,
  })
  .then(response => {
    console.log('Data successfully sent to Webhook.site:', response.data);
  })
  .catch(error => {
    console.error('Error sending data to Webhook.site:', error);
  });

}).catch((error) => {
  console.error("An error occurred while fetching the accessibility results:", error);
  process.exit(1);
});
