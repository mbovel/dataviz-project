function get_unique_values(data, field) {
	return [...d3.rollup(data, _ => undefined, d => d[field]).keys()];
}

function mod(a, n) {
	return ((a % n) + n) % n;
}
