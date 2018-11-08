var ParticleSeeder = require('./ParticleSeeder');
var ParticleSorter = require('./ParticleSorter');
var RadiusSearch = require('./RadiusSearch');
var ParticleVelocity = require('./ParticleVelocity');

$(function () {
	var width = $('#canvas').width();
	var height = $('#canvas').height();
	var depth = height;
	var radius = height/2;
	var count = 25;

	var particles = ParticleSeeder(count, width, height, depth, 1);
	ParticleSorter(particles);

	var canvas = $('#canvas');
	canvas.attr('width', width).attr('height', height);

	var ctx = canvas[0].getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.lineWidth = 2;


	var animate = function () {
		ParticleVelocity(particles, width, height, depth);
		ParticleSorter(particles);

		ctx.clearRect(0, 0, width, height);

		for (var i = 0; i < particles.length; i++) {
			var lines = RadiusSearch(particles, i, radius);
			var particle = particles[i];

			

			for (var j = 0; j < lines.length; j++) {
				ctx.beginPath();
				var line = lines[j];
				ctx.strokeStyle = 'rgba(255, 255, 255, '+ (1-line.distance/radius) +')';
				ctx.moveTo(particle.coordinates[0], particle.coordinates[1]);
				ctx.lineTo(line.particle.coordinates[0], line.particle.coordinates[1]);
				ctx.closePath();
				ctx.stroke();
			}

			ctx.beginPath();
			ctx.arc(
				particle.coordinates[0],
				particle.coordinates[1],
				6-Math.pow(Math.sqrt(5.9)*(particle.coordinates[2]/depth), 2),
				0,
				2*Math.PI
			);

			ctx.fill();
			ctx.closePath();
		}

		window.requestAnimationFrame(animate);
	};

	window.requestAnimationFrame(animate);
});