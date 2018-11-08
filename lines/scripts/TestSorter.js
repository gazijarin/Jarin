var ParticleSeeder = require('./ParticleSeeder');
var ParticleSorter = require('./ParticleSorter');
var RadiusSearch = require('./RadiusSearch');
var ParticleVelocity = require('./ParticleVelocity');

$(function () {
	var width = $(window).innerWidth();
	var height = $(window).innerHeight();
	var depth = height;
	var radius = height/2;
	var count = 20;

	var particles = ParticleSeeder(count, width, height, depth, 5);

	var c = $('#container');

	for (var i = 0; i < particles.length; i++) {
		particles[i].name = i+1;
		particles[i].dom = $('<div></div>');
		particles[i].dom.css({
			top: (i*40) + 'px'
		});

		c.append(particles[i].dom);
	}


	var animate = function () {
		ParticleVelocity(particles, width, height, depth);
		ParticleSorter(particles);

		for (var i = 0; i < particles.length; i++) {
			particles[i].dom.html(
				'<b>' + particles[i].name + '</b>' + 
				':' + 
				particles[i].coordinates[0] + 
				',' +
				particles[i].coordinates[1] + 
				',' +
				particles[i].coordinates[2]
			);

			particles[i].dom.data('index', i);

			particles[i].dom.css({
				background: '#333',
				width: (0.5*particles[i].coordinates[0]) + 'px',
				top: (i*40) + 'px'
			});
		}
	};

	var interval = setInterval(animate, 500);

	$('#tog').click(function () {
		if (interval === null) {
			interval = setInterval(animate, 500);
		} else {
			clearInterval(interval);
			interval = null;
		}
	});

	$('#container > div').click(function () {
		console.log('HEHE');
		var index = $(this).data('index');
		var points = RadiusSearch(particles, index, 100);

		for (var i = 0; i < points.length; i++) {
			points[i].particle.dom.css('background', '#f00');
		}
	});
});