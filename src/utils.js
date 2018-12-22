function clamp(n, min, max) {
	return Math.min(Math.max(n, min), max);
}

// Split a Date object into an array [year, month, day]
function getDateComponents(date) {
	return [date.getFullYear(), date.getMonth(), date.getDate()];
}

// Run a promise without doing anything with its result.
function runPromise(/**Promise*/ promise) {
	promise.catch(console.error);
}

// Select an option in a select elements by value.
function selectOption(/**HTMLSelectElement*/ el, value) {
	const newIndex = [...el.options].map(optionEl => optionEl.value).indexOf(value);
	if (newIndex !== el.selectedIndex) {
		el.selectedIndex = newIndex;
		el.dispatchEvent(new Event("change"));
	}
}

function whenDocumentLoaded(handler) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", handler);
	} else {
		handler();
	}
}

// From https://github.com/substack/deep-freeze.
function deepFreeze(/**Object*/ o) {
	Object.freeze(o);
	Object.getOwnPropertyNames(o).forEach(function(prop) {
		if (
			o.hasOwnProperty(prop) &&
			o[prop] !== null &&
			(typeof o[prop] === "object" || typeof o[prop] === "function") &&
			!Object.isFrozen(o[prop])
		) {
			deepFreeze(o[prop]);
		}
	});
	return o;
}
