(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ParticleSeeder = require('./ParticleSeeder');
var ParticleSorter = require('./ParticleSorter');
var RadiusSearch = require('./RadiusSearch');

var particles = ParticleSeeder(100, 50, 50, 50, 5);
ParticleSorter(particles);

for (var i = 0; i < particles.length; i++) {
	console.log(RadiusSearch(particles, i, 10));
}
},{"./ParticleSeeder":2,"./ParticleSorter":3,"./RadiusSearch":4}],2:[function(require,module,exports){
var rand = require('./Rand');

var ParticleSeeder = function (n, width, height, depth, max_velocity_component) {
	var particles = [];

	for (var i = 0; i < n; i++) {
		particles.push({
			coordinates: [
				rand(0, width),
				rand(0, height),
				rand(0, depth)
			],
			velocity: [
				rand(0, max_velocity_component),
				rand(0, max_velocity_component),
				rand(0, max_velocity_component)
			]
		});
	}

	return particles;
};

module.exports = ParticleSeeder;
},{"./Rand":5}],3:[function(require,module,exports){
module.exports = function (particles) {
	for (var i = 1; i < particles.length; i++) {
		var tmp = particles[i];

		for (var j = i; j > 0; j--) {
			if (j > 0 && particles[j-1].coordinates[0] > tmp.coordinates[0]) {
				particles[j] = particles[j-1];
				continue;
			}
			
			break;
		}

		particles[j] = tmp;
	}
};
},{}],4:[function(require,module,exports){
module.exports = function (particles, index, radius) {
	var particle = particles[index];
	var r_sqr = Math.pow(radius, 2);
	var x_max = particle.coordinates[0]+radius;
	var y_max = particle.coordinates[1]+radius;
	var z_max = particle.coordinates[2]+radius;


	var in_range = [];

	for (var i = index+1; i < particles.length; i++) {
		var cur_p = particles[i];
		if (cur_p.coordinates[0] <= x_max && cur_p.coordinates[1] <= y_max && cur_p.coordinates[2] <= z_max) {
			var s_sqr = Math.pow(cur_p.coordinates[0], 2) + Math.pow(cur_p.coordinates[1], 2) + Math.pow(cur_p.coordinates[2], 2);
			
			if (s_sqr <= r_sqr) {
				in_range.push({
					particle: cur_p,
					distance: Math.sqrt(s_sqr)
				});
			}
		}
	}

	return in_range;
};
},{}],5:[function(require,module,exports){
module.exports = function (min, max) {
	return min+(Math.round(Math.random()*Math.pow(10, Math.floor(Math.log10(max))+1))%(max-min));
};
},{}]},{},[1]);
