module.exports = function (particles, width, height, depth) {
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];

		var x = particle.coordinates[0]+particle.velocity[0];
		var y = particle.coordinates[1]+particle.velocity[1];
		var z = particle.coordinates[2]+particle.velocity[2];

		if (x > width || x < 0) {
			particle.velocity[0] *= -1;
		}

		if (y > height || y < 0) {
			particle.velocity[1] *= -1;
		}

		if (z > depth || z < 0) {
			particle.velocity[2] *= -1;
		}

		particle.coordinates[0] += particle.velocity[0];
		particle.coordinates[1] += particle.velocity[1];
		particle.coordinates[2] += particle.velocity[2];
	}
};