$(function(){
	var win = $(window);
	var win_height = win.height();
	var win_width = win.width();

	var position = {
		x: win_width*0.25,
		y: win_height*0.2
	};

	var radius = win_width-position.x;
	var vert_radius = win_height-position.y;

	var typist = $("#typist");
	var tagline = typist.html();
	typist.html("");

	typist.typed({
		strings: [tagline],
		typeSpeed: 1,
		cursorChar: "&#9608;",
	});

	var recalc = function() {
		// var intro_section = $('.intro');
		// var intro_height = intro_section.height();

		// var px = ((win_height-intro_height)/8);

		// if ($('body').css('margin-bottom') === '1px') {
		// 	px = ((win_height-intro_height)/2);
		// }

		// intro_section.css('margin-bottom', px+'px');
		// $('.main').css('padding-top', px+'px');
	};

	recalc();

	var status = false;
	var initialize = function() {
		status = true;

		threedee.init({
			axes: false,
			orbit_controls: false,
			height: win.height(),
			width: win.width()*0.5,
			plane_color: 0x2B2B2B,
		});

		$(document).mousemove(function(e){
			var x = -((e.clientX-position.x)/radius)*150+40;
			var z = Math.sqrt(Math.pow(150, 2) - Math.pow(x, 2));
			var y = ((e.clientY)/vert_radius)*300+20;

			threedee.camera(x, y, z);
		});

		win.resize(function(){
			win_height = win.height();
			win_width = win.width();

			threedee.resize(win_width*0.5, win_height);
		});
	};

	if (Modernizr.webgl && !status && $('body').css('margin-bottom') === '1px') {
		initialize();
	} else {
		$('#svg').show();
		$('#target').hide();
	}

	win.resize(function(){
		recalc();

		if (Modernizr.webgl && $('body').css('margin-bottom') == '1px') {
			$('#svg').hide();
			$('#target').show();

			if (!status) {
				initialize();
			}
		} else if ($('body').css('margin-bottom') !== '1px') {
			$('#svg').show();
			$('#target').hide();
		}
	});
});