/**
 * 
 * Force Reload on Back Button
 * https://stackoverflow.com/a/75952012
 * 
 */ 

window.addEventListener("pageshow", function (event) {
  var historyTraversal = event.persisted,
    perf = window.performance,
    perfEntries = perf && perf.getEntriesByType && perf.getEntriesByType("navigation"),
    perfEntryType = perfEntries && perfEntries[0] && perfEntries[0].type,
    navigationType = perf && perf.navigation && perf.navigation.type;
  if (
    historyTraversal ||
    perfEntryType === "back_forward" ||
    navigationType === 2 
  ) {
    // Handle page restore.
    window.location.reload();
  }
});