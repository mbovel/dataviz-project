function getUniqueValues(data, field) {
	return [...d3.rollup(data, _ => undefined, d => d[field]).keys()];
}

function mod(a, n) {
	return ((a % n) + n) % n;
}

function clamp(n, min, max) {
	return Math.min(Math.max(n, min), max);
}

// See https://github.com/d3/d3-time-format
const formatDate = d3.timeFormat("%Y-%m-%d");
const parseDate = d3.timeFormat("%Y-%m-%d");
const formatYear = d3.timeFormat("%Y");
const formatMonth = d3.timeFormat("%B");
const formatDay = d3.timeFormat("%A %-d");

function hideIf(element, condition) {
	if (condition) element.setAttribute("hidden", true);
	else element.removeAttribute("hidden");
}

// From https://dzone.com/articles/determining-number-days-month
// Deliberately overflowing the day parameter and checking how far the
// resulting date overlaps into the next month is a quick way to tell
// how many days there were in the queried month.
function daysInMonth(year, month) {
	return 32 - new Date(year, month, 32).getDate();
}

function getDateComponents(date) {
	// getDate return the day of the month… Bad, bad, bad naming.
	return [date.getFullYear(), date.getMonth(), date.getDate()];
}
