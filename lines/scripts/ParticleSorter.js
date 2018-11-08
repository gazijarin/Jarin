module.exports = function (particles) {
	particles.sort(function (a, b) {
		if (a.coordinates[0] < b.coordinates[0]) {
			return -1;
		}

		if (a.coordinates[0] > b.coordinates[0]) {
			return 1;
		}

		return 0;
	});
};