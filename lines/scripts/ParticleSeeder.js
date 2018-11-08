var rand = require('./Rand');

var ParticleSeeder = function (n, width, height, depth, max_velocity_component) {
	console.log(max_velocity_component);
	var particles = [];

	for (var i = 0; i < n; i++) {
		particles.push({
			coordinates: [
				rand(0, width),
				rand(0, height),
				rand(0, depth)
			],
			velocity: [
				rand(-1*max_velocity_component*100, max_velocity_component*100)/100,
				rand(-1*max_velocity_component*100, max_velocity_component*100)/100,
				rand(-1*max_velocity_component*100, max_velocity_component*100)/100
			]
		});
	}

	return particles;
};

module.exports = ParticleSeeder;