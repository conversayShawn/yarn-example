const { getAccessibilityResults } = require('@cypress/extract-cloud-results');

getAccessibilityResults({
  projectId: process.env.CYPRESS_PROJECT_ID,
  recordKey: process.env.CYPRESS_RECORD_KEY,
  runTags: process.env.RUN_TAGS,
}).then((results) => {
  const { runNumber, accessibilityReportUrl, summary, rules } = results;
  const { total } = summary.violationCounts;

  console.log(`Received ${summary.isPartialReport ? "partial" : ""} results for run #${runNumber}.`);
  console.log(`See full report at ${accessibilityReportUrl}.`);

  // Conditional logic based on the results
  if (total > 0) {
    const { critical, serious, moderate, minor } = summary.violationCounts;

    console.log(`${total} Accessibility violations were detected - ${critical} critical, ${serious} serious, ${moderate} moderate, and ${minor} minor.`);
    console.log("The following rules were violated:");
    console.log(rules);

    throw new Error(`${total} Accessibility violations detected and must be fixed.`);
  }

  console.log("No Accessibility violations detected!");
}).catch((error) => {
  console.error("An error occurred while fetching the accessibility results:", error);
  process.exit(1);
});
