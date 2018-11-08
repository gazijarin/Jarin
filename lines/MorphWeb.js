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
},{"./ParticleSeeder":1,"./ParticleSorter":2,"./ParticleVelocity":3,"./RadiusSearch":4}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9QYXJ0aWNsZVNlZWRlci5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1BhcnRpY2xlU29ydGVyLmpzIiwiL21udC9DQUMyRDIxMEMyRDIwMTFEL1dlYlNlcnZlci9sb2NhbGhvc3QvaGVkcm9uaXVtL2xpbmVzL3NjcmlwdHMvUGFydGljbGVWZWxvY2l0eS5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhZGl1c1NlYXJjaC5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhbmQuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9mYWtlX2RmNzQ1YTM3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByYW5kID0gcmVxdWlyZSgnLi9SYW5kJyk7XG5cbnZhciBQYXJ0aWNsZVNlZWRlciA9IGZ1bmN0aW9uIChuLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCkge1xuXHRjb25zb2xlLmxvZyhtYXhfdmVsb2NpdHlfY29tcG9uZW50KTtcblx0dmFyIHBhcnRpY2xlcyA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdFx0cGFydGljbGVzLnB1c2goe1xuXHRcdFx0Y29vcmRpbmF0ZXM6IFtcblx0XHRcdFx0cmFuZCgwLCB3aWR0aCksXG5cdFx0XHRcdHJhbmQoMCwgaGVpZ2h0KSxcblx0XHRcdFx0cmFuZCgwLCBkZXB0aClcblx0XHRcdF0sXG5cdFx0XHR2ZWxvY2l0eTogW1xuXHRcdFx0XHRyYW5kKC0xKm1heF92ZWxvY2l0eV9jb21wb25lbnQqMTAwLCBtYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCkvMTAwLFxuXHRcdFx0XHRyYW5kKC0xKm1heF92ZWxvY2l0eV9jb21wb25lbnQqMTAwLCBtYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCkvMTAwLFxuXHRcdFx0XHRyYW5kKC0xKm1heF92ZWxvY2l0eV9jb21wb25lbnQqMTAwLCBtYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCkvMTAwXG5cdFx0XHRdXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcGFydGljbGVzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJ0aWNsZVNlZWRlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXJ0aWNsZXMpIHtcblx0cGFydGljbGVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRpZiAoYS5jb29yZGluYXRlc1swXSA8IGIuY29vcmRpbmF0ZXNbMF0pIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRpZiAoYS5jb29yZGluYXRlc1swXSA+IGIuY29vcmRpbmF0ZXNbMF0pIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblxuXHRcdHJldHVybiAwO1xuXHR9KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFydGljbGVzLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCkge1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcGFydGljbGUgPSBwYXJ0aWNsZXNbaV07XHJcblxyXG5cdFx0dmFyIHggPSBwYXJ0aWNsZS5jb29yZGluYXRlc1swXStwYXJ0aWNsZS52ZWxvY2l0eVswXTtcclxuXHRcdHZhciB5ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMV0rcGFydGljbGUudmVsb2NpdHlbMV07XHJcblx0XHR2YXIgeiA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdK3BhcnRpY2xlLnZlbG9jaXR5WzJdO1xyXG5cclxuXHRcdGlmICh4ID4gd2lkdGggfHwgeCA8IDApIHtcclxuXHRcdFx0cGFydGljbGUudmVsb2NpdHlbMF0gKj0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHkgPiBoZWlnaHQgfHwgeSA8IDApIHtcclxuXHRcdFx0cGFydGljbGUudmVsb2NpdHlbMV0gKj0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHogPiBkZXB0aCB8fCB6IDwgMCkge1xyXG5cdFx0XHRwYXJ0aWNsZS52ZWxvY2l0eVsyXSAqPSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1swXSArPSBwYXJ0aWNsZS52ZWxvY2l0eVswXTtcclxuXHRcdHBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdICs9IHBhcnRpY2xlLnZlbG9jaXR5WzFdO1xyXG5cdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMl0gKz0gcGFydGljbGUudmVsb2NpdHlbMl07XHJcblx0fVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBhcnRpY2xlcywgaW5kZXgsIHJhZGl1cykge1xuXHR2YXIgcGFydGljbGUgPSBwYXJ0aWNsZXNbaW5kZXhdO1xuXHR2YXIgcl9zcXIgPSBNYXRoLnBvdyhyYWRpdXMsIDIpO1xuXHR2YXIgeF9tYXggPSBwYXJ0aWNsZS5jb29yZGluYXRlc1swXStyYWRpdXM7XG5cdHZhciB5X21heCA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdK3JhZGl1cztcblx0dmFyIHpfbWF4ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMl0rcmFkaXVzO1xuXG5cblx0dmFyIGluX3JhbmdlID0gW107XG5cblx0Zm9yICh2YXIgaSA9IGluZGV4KzE7IGkgPCBwYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgY3VyX3AgPSBwYXJ0aWNsZXNbaV07XG5cdFx0aWYgKGN1cl9wLmNvb3JkaW5hdGVzWzBdIDw9IHhfbWF4KSB7XG5cdFx0XHR2YXIgcyA9IE1hdGguc3FydChcblx0XHRcdFx0TWF0aC5wb3coY3VyX3AuY29vcmRpbmF0ZXNbMF0tcGFydGljbGUuY29vcmRpbmF0ZXNbMF0sIDIpIFxuXHRcdFx0XHQrIE1hdGgucG93KGN1cl9wLmNvb3JkaW5hdGVzWzFdLXBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdLCAyKVxuXHRcdFx0XHQrIE1hdGgucG93KGN1cl9wLmNvb3JkaW5hdGVzWzJdLXBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdLCAyKVxuXHRcdFx0KTtcblx0XHRcdFxuXHRcdFx0aWYgKGN1cl9wLmNvb3JkaW5hdGVzWzFdIDw9IHlfbWF4ICYmIGN1cl9wLmNvb3JkaW5hdGVzWzJdIDw9IHpfbWF4ICYmIHMgPD0gcmFkaXVzKSB7XG5cdFx0XHRcdGluX3JhbmdlLnB1c2goe1xuXHRcdFx0XHRcdHBhcnRpY2xlOiBjdXJfcCxcblx0XHRcdFx0XHRkaXN0YW5jZTogc1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGluX3JhbmdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuXHRyZXR1cm4gbWluKyhNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2cxMChtYXgpKSsxKSklKG1heC1taW4pKTtcbn07IiwidmFyIFBhcnRpY2xlU2VlZGVyID0gcmVxdWlyZSgnLi9QYXJ0aWNsZVNlZWRlcicpO1xudmFyIFBhcnRpY2xlU29ydGVyID0gcmVxdWlyZSgnLi9QYXJ0aWNsZVNvcnRlcicpO1xudmFyIFJhZGl1c1NlYXJjaCA9IHJlcXVpcmUoJy4vUmFkaXVzU2VhcmNoJyk7XG52YXIgUGFydGljbGVWZWxvY2l0eSA9IHJlcXVpcmUoJy4vUGFydGljbGVWZWxvY2l0eScpO1xuXG4kKGZ1bmN0aW9uICgpIHtcblx0dmFyIHdpZHRoID0gJCgnI2NhbnZhcycpLndpZHRoKCk7XG5cdHZhciBoZWlnaHQgPSAkKCcjY2FudmFzJykuaGVpZ2h0KCk7XG5cdHZhciBkZXB0aCA9IGhlaWdodDtcblx0dmFyIHJhZGl1cyA9IGhlaWdodC8yO1xuXHR2YXIgY291bnQgPSAyNTtcblxuXHR2YXIgcGFydGljbGVzID0gUGFydGljbGVTZWVkZXIoY291bnQsIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCAxKTtcblx0UGFydGljbGVTb3J0ZXIocGFydGljbGVzKTtcblxuXHR2YXIgY2FudmFzID0gJCgnI2NhbnZhcycpO1xuXHRjYW52YXMuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KTtcblxuXHR2YXIgY3R4ID0gY2FudmFzWzBdLmdldENvbnRleHQoJzJkJyk7XG5cdGN0eC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG5cdGN0eC5saW5lV2lkdGggPSAyO1xuXG5cblx0dmFyIGFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0UGFydGljbGVWZWxvY2l0eShwYXJ0aWNsZXMsIHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcblx0XHRQYXJ0aWNsZVNvcnRlcihwYXJ0aWNsZXMpO1xuXG5cdFx0Y3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgbGluZXMgPSBSYWRpdXNTZWFyY2gocGFydGljbGVzLCBpLCByYWRpdXMpO1xuXHRcdFx0dmFyIHBhcnRpY2xlID0gcGFydGljbGVzW2ldO1xuXG5cdFx0XHRcblxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdHZhciBsaW5lID0gbGluZXNbal07XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsICcrICgxLWxpbmUuZGlzdGFuY2UvcmFkaXVzKSArJyknO1xuXHRcdFx0XHRjdHgubW92ZVRvKHBhcnRpY2xlLmNvb3JkaW5hdGVzWzBdLCBwYXJ0aWNsZS5jb29yZGluYXRlc1sxXSk7XG5cdFx0XHRcdGN0eC5saW5lVG8obGluZS5wYXJ0aWNsZS5jb29yZGluYXRlc1swXSwgbGluZS5wYXJ0aWNsZS5jb29yZGluYXRlc1sxXSk7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHguYXJjKFxuXHRcdFx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1swXSxcblx0XHRcdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMV0sXG5cdFx0XHRcdDYtTWF0aC5wb3coTWF0aC5zcXJ0KDUuOSkqKHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdL2RlcHRoKSwgMiksXG5cdFx0XHRcdDAsXG5cdFx0XHRcdDIqTWF0aC5QSVxuXHRcdFx0KTtcblxuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHR9XG5cblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuXHR9O1xuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59KTsiXX0=
