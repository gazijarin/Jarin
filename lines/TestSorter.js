(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./Rand":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
		if (cur_p.coordinates[0] <= x_max) {
			var s = Math.sqrt(
				Math.pow(cur_p.coordinates[0]-particle.coordinates[0], 2) 
				+ Math.pow(cur_p.coordinates[1]-particle.coordinates[1], 2)
				+ Math.pow(cur_p.coordinates[2]-particle.coordinates[2], 2)
			);
			
			if (cur_p.coordinates[1] <= y_max && cur_p.coordinates[2] <= z_max && s <= radius) {
				in_range.push({
					particle: cur_p,
					distance: s
				});
			}
		} else {
			break;
		}
	}

	return in_range;
};
},{}],5:[function(require,module,exports){
module.exports = function (min, max) {
	return min+(Math.round(Math.random()*Math.pow(10, Math.floor(Math.log10(max))+1))%(max-min));
};
},{}],6:[function(require,module,exports){
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
},{"./ParticleSeeder":1,"./ParticleSorter":2,"./ParticleVelocity":3,"./RadiusSearch":4}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9QYXJ0aWNsZVNlZWRlci5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1BhcnRpY2xlU29ydGVyLmpzIiwiL21udC9DQUMyRDIxMEMyRDIwMTFEL1dlYlNlcnZlci9sb2NhbGhvc3QvaGVkcm9uaXVtL2xpbmVzL3NjcmlwdHMvUGFydGljbGVWZWxvY2l0eS5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhZGl1c1NlYXJjaC5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhbmQuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9mYWtlXzIyNGY3MWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmFuZCA9IHJlcXVpcmUoJy4vUmFuZCcpO1xuXG52YXIgUGFydGljbGVTZWVkZXIgPSBmdW5jdGlvbiAobiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1heF92ZWxvY2l0eV9jb21wb25lbnQpIHtcblx0Y29uc29sZS5sb2cobWF4X3ZlbG9jaXR5X2NvbXBvbmVudCk7XG5cdHZhciBwYXJ0aWNsZXMgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdHBhcnRpY2xlcy5wdXNoKHtcblx0XHRcdGNvb3JkaW5hdGVzOiBbXG5cdFx0XHRcdHJhbmQoMCwgd2lkdGgpLFxuXHRcdFx0XHRyYW5kKDAsIGhlaWdodCksXG5cdFx0XHRcdHJhbmQoMCwgZGVwdGgpXG5cdFx0XHRdLFxuXHRcdFx0dmVsb2NpdHk6IFtcblx0XHRcdFx0cmFuZCgtMSptYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCoxMDApLzEwMCxcblx0XHRcdFx0cmFuZCgtMSptYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCoxMDApLzEwMCxcblx0XHRcdFx0cmFuZCgtMSptYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCoxMDApLzEwMFxuXHRcdFx0XVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHBhcnRpY2xlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGVTZWVkZXI7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFydGljbGVzKSB7XG5cdHBhcnRpY2xlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0aWYgKGEuY29vcmRpbmF0ZXNbMF0gPCBiLmNvb3JkaW5hdGVzWzBdKSB7XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0aWYgKGEuY29vcmRpbmF0ZXNbMF0gPiBiLmNvb3JkaW5hdGVzWzBdKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gMDtcblx0fSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBhcnRpY2xlcywgd2lkdGgsIGhlaWdodCwgZGVwdGgpIHtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHBhcnRpY2xlID0gcGFydGljbGVzW2ldO1xyXG5cclxuXHRcdHZhciB4ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMF0rcGFydGljbGUudmVsb2NpdHlbMF07XHJcblx0XHR2YXIgeSA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdK3BhcnRpY2xlLnZlbG9jaXR5WzFdO1xyXG5cdFx0dmFyIHogPSBwYXJ0aWNsZS5jb29yZGluYXRlc1syXStwYXJ0aWNsZS52ZWxvY2l0eVsyXTtcclxuXHJcblx0XHRpZiAoeCA+IHdpZHRoIHx8IHggPCAwKSB7XHJcblx0XHRcdHBhcnRpY2xlLnZlbG9jaXR5WzBdICo9IC0xO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh5ID4gaGVpZ2h0IHx8IHkgPCAwKSB7XHJcblx0XHRcdHBhcnRpY2xlLnZlbG9jaXR5WzFdICo9IC0xO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh6ID4gZGVwdGggfHwgeiA8IDApIHtcclxuXHRcdFx0cGFydGljbGUudmVsb2NpdHlbMl0gKj0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMF0gKz0gcGFydGljbGUudmVsb2NpdHlbMF07XHJcblx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1sxXSArPSBwYXJ0aWNsZS52ZWxvY2l0eVsxXTtcclxuXHRcdHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdICs9IHBhcnRpY2xlLnZlbG9jaXR5WzJdO1xyXG5cdH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXJ0aWNsZXMsIGluZGV4LCByYWRpdXMpIHtcblx0dmFyIHBhcnRpY2xlID0gcGFydGljbGVzW2luZGV4XTtcblx0dmFyIHJfc3FyID0gTWF0aC5wb3cocmFkaXVzLCAyKTtcblx0dmFyIHhfbWF4ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMF0rcmFkaXVzO1xuXHR2YXIgeV9tYXggPSBwYXJ0aWNsZS5jb29yZGluYXRlc1sxXStyYWRpdXM7XG5cdHZhciB6X21heCA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdK3JhZGl1cztcblxuXG5cdHZhciBpbl9yYW5nZSA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSBpbmRleCsxOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGN1cl9wID0gcGFydGljbGVzW2ldO1xuXHRcdGlmIChjdXJfcC5jb29yZGluYXRlc1swXSA8PSB4X21heCkge1xuXHRcdFx0dmFyIHMgPSBNYXRoLnNxcnQoXG5cdFx0XHRcdE1hdGgucG93KGN1cl9wLmNvb3JkaW5hdGVzWzBdLXBhcnRpY2xlLmNvb3JkaW5hdGVzWzBdLCAyKSBcblx0XHRcdFx0KyBNYXRoLnBvdyhjdXJfcC5jb29yZGluYXRlc1sxXS1wYXJ0aWNsZS5jb29yZGluYXRlc1sxXSwgMilcblx0XHRcdFx0KyBNYXRoLnBvdyhjdXJfcC5jb29yZGluYXRlc1syXS1wYXJ0aWNsZS5jb29yZGluYXRlc1syXSwgMilcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdGlmIChjdXJfcC5jb29yZGluYXRlc1sxXSA8PSB5X21heCAmJiBjdXJfcC5jb29yZGluYXRlc1syXSA8PSB6X21heCAmJiBzIDw9IHJhZGl1cykge1xuXHRcdFx0XHRpbl9yYW5nZS5wdXNoKHtcblx0XHRcdFx0XHRwYXJ0aWNsZTogY3VyX3AsXG5cdFx0XHRcdFx0ZGlzdGFuY2U6IHNcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBpbl9yYW5nZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcblx0cmV0dXJuIG1pbisoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKk1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nMTAobWF4KSkrMSkpJShtYXgtbWluKSk7XG59OyIsInZhciBQYXJ0aWNsZVNlZWRlciA9IHJlcXVpcmUoJy4vUGFydGljbGVTZWVkZXInKTtcbnZhciBQYXJ0aWNsZVNvcnRlciA9IHJlcXVpcmUoJy4vUGFydGljbGVTb3J0ZXInKTtcbnZhciBSYWRpdXNTZWFyY2ggPSByZXF1aXJlKCcuL1JhZGl1c1NlYXJjaCcpO1xudmFyIFBhcnRpY2xlVmVsb2NpdHkgPSByZXF1aXJlKCcuL1BhcnRpY2xlVmVsb2NpdHknKTtcblxuJChmdW5jdGlvbiAoKSB7XG5cdHZhciB3aWR0aCA9ICQod2luZG93KS5pbm5lcldpZHRoKCk7XG5cdHZhciBoZWlnaHQgPSAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcblx0dmFyIGRlcHRoID0gaGVpZ2h0O1xuXHR2YXIgcmFkaXVzID0gaGVpZ2h0LzI7XG5cdHZhciBjb3VudCA9IDIwO1xuXG5cdHZhciBwYXJ0aWNsZXMgPSBQYXJ0aWNsZVNlZWRlcihjb3VudCwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIDUpO1xuXG5cdHZhciBjID0gJCgnI2NvbnRhaW5lcicpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0cGFydGljbGVzW2ldLm5hbWUgPSBpKzE7XG5cdFx0cGFydGljbGVzW2ldLmRvbSA9ICQoJzxkaXY+PC9kaXY+Jyk7XG5cdFx0cGFydGljbGVzW2ldLmRvbS5jc3Moe1xuXHRcdFx0dG9wOiAoaSo0MCkgKyAncHgnXG5cdFx0fSk7XG5cblx0XHRjLmFwcGVuZChwYXJ0aWNsZXNbaV0uZG9tKTtcblx0fVxuXG5cblx0dmFyIGFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0UGFydGljbGVWZWxvY2l0eShwYXJ0aWNsZXMsIHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcblx0XHRQYXJ0aWNsZVNvcnRlcihwYXJ0aWNsZXMpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBhcnRpY2xlc1tpXS5kb20uaHRtbChcblx0XHRcdFx0JzxiPicgKyBwYXJ0aWNsZXNbaV0ubmFtZSArICc8L2I+JyArIFxuXHRcdFx0XHQnOicgKyBcblx0XHRcdFx0cGFydGljbGVzW2ldLmNvb3JkaW5hdGVzWzBdICsgXG5cdFx0XHRcdCcsJyArXG5cdFx0XHRcdHBhcnRpY2xlc1tpXS5jb29yZGluYXRlc1sxXSArIFxuXHRcdFx0XHQnLCcgK1xuXHRcdFx0XHRwYXJ0aWNsZXNbaV0uY29vcmRpbmF0ZXNbMl1cblx0XHRcdCk7XG5cblx0XHRcdHBhcnRpY2xlc1tpXS5kb20uZGF0YSgnaW5kZXgnLCBpKTtcblxuXHRcdFx0cGFydGljbGVzW2ldLmRvbS5jc3Moe1xuXHRcdFx0XHRiYWNrZ3JvdW5kOiAnIzMzMycsXG5cdFx0XHRcdHdpZHRoOiAoMC41KnBhcnRpY2xlc1tpXS5jb29yZGluYXRlc1swXSkgKyAncHgnLFxuXHRcdFx0XHR0b3A6IChpKjQwKSArICdweCdcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChhbmltYXRlLCA1MDApO1xuXG5cdCQoJyN0b2cnKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKGludGVydmFsID09PSBudWxsKSB7XG5cdFx0XHRpbnRlcnZhbCA9IHNldEludGVydmFsKGFuaW1hdGUsIDUwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0aW50ZXJ2YWwgPSBudWxsO1xuXHRcdH1cblx0fSk7XG5cblx0JCgnI2NvbnRhaW5lciA+IGRpdicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnSEVIRScpO1xuXHRcdHZhciBpbmRleCA9ICQodGhpcykuZGF0YSgnaW5kZXgnKTtcblx0XHR2YXIgcG9pbnRzID0gUmFkaXVzU2VhcmNoKHBhcnRpY2xlcywgaW5kZXgsIDEwMCk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cG9pbnRzW2ldLnBhcnRpY2xlLmRvbS5jc3MoJ2JhY2tncm91bmQnLCAnI2YwMCcpO1xuXHRcdH1cblx0fSk7XG59KTsiXX0=
