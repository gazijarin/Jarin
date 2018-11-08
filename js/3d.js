var threedee = (function(){
	var config = {
		orbit_controls: true,
		axes: true
	};

	var unify = function (obj1,obj2) {
		var obj3 = {};

		for (var attrname in obj1) {
			obj3[attrname] = obj1[attrname];
		}

		for (var attrname2 in obj2) {
			obj3[attrname2] = obj2[attrname2];
		}

		return obj3;
	};

	var win = $(window);
	var scene = null;
	var renderer = null;
	var controls = null;

	var plane = null;

	var cameras = {
		main: null
	};

	var tetras = {
		bottom: null,
		top: null
	};

	var rad = function (deg) {
		return deg*Math.PI/180;
	};

	var buzz = function(funcs) {
		for (var func in funcs) {
			if (typeof funcs[func] === "function") {
				funcs[func]();
			}
		}
	};

	var consts = {
		cylinder_radius: 3,
		sphere_radius: 10,
		side_length: 80,
		tetra_height: 65
	};

	var calcs = (function(){
		var sphere_center_offset = (consts.side_length/2)/Math.cos(rad(30));
		var side_center_offset = sphere_center_offset*Math.sin(rad(30));
		var vertical_side_length = Math.sqrt(Math.pow(sphere_center_offset, 2) + Math.pow(consts.tetra_height, 2));
		var vertical_angle = Math.atan(consts.tetra_height/sphere_center_offset);

		return {
			sphere_center_offset: sphere_center_offset,
			side_center_offset: side_center_offset,
			vertical_side_length: vertical_side_length,
			vertical_angle: vertical_angle
		};
	})();

	var vals = unify(consts, calcs);

	var geos = {
		sphere: new THREE.SphereGeometry(
			vals.sphere_radius, 15, 15
		)
	};

	var mats = {
		main: new THREE.MeshLambertMaterial({
			color: 0xFFFFFF,
			shading: 'smooth',
			wireframeLinewidth: 3
		}),
		beam: new THREE.MeshLambertMaterial({
			color: 0xFFFFFF,
			shading: 'smooth',
			// wireframe: true,
			wireframeLinewidth: 2
		}),
	};

	var lights = {
		ambient: function () {
			var light = new THREE.AmbientLight(0xffffff);
			scene.add(light);
		},
		directional: function () {
			var light = new THREE.DirectionalLight( 0xffffff, 0.3 );
			light.position.x = 300;
			light.position.y = 300;
			light.position.z = 300;
			light.castShadow = true;
			light.shadowDarkness = 0.3;

			light.target = plane;

			light.shadowMapWidth = 1024; // default is 512
			light.shadowMapHeight = 1024; // default is 512


			scene.add(light);
		},
		spot: null
	};

	var meshes = function () {
		var tetra = new THREE.Object3D();

		// <BALLS>
			var ball_a = new THREE.Mesh(
				geos.sphere,
				mats.main
			);

			ball_a.castShadow = true;
			ball_a.receiveShadow = true;

			ball_a.position.z = -1*vals.sphere_center_offset;

			var ball_aa = new THREE.Object3D();
			ball_aa.add(ball_a);

			tetra.add(ball_aa);

			var ball_b = ball_a.clone();
			var ball_bb = new THREE.Object3D();
			ball_bb.add(ball_b);

			ball_bb.rotation.y = rad(120);

			tetra.add(ball_bb);

			var ball_c = ball_a.clone();
			var ball_cc = new THREE.Object3D();
			ball_cc.add(ball_c);

			ball_cc.rotation.y = rad(-120);

			tetra.add(ball_cc);

			ball_d = ball_a.clone();
			ball_d.position.z = 0;
			ball_d.position.y = vals.tetra_height;

			tetra.add(ball_d);
		// </BALLS>

		// <BEAMS - HORI>
			var beam_bc = new THREE.Mesh(
				geos.flatCylinder, mats.beam
			);

			beam_bc.castShadow = true;
			beam_bc.receiveShadow = true;

			beam_bc.rotation.z = rad(90);
			beam_bc.position.z = vals.side_center_offset;

			var beam_bcp = new THREE.Object3D();
			beam_bcp.add(beam_bc);
			tetra.add(beam_bcp);

			var beam_ab = beam_bc.clone();
			var beam_abp = new THREE.Object3D();
			beam_abp.add(beam_ab);
			beam_abp.rotation.y = rad(-120);
			tetra.add(beam_abp);

			var beam_ac = beam_bc.clone();
			var beam_acp = new THREE.Object3D();
			beam_acp.add(beam_ac);
			beam_acp.rotation.y = rad(120);
			tetra.add(beam_acp);
		// </BEAMS - HORI>

		// <BEAMS - VERT>
			var beam_ad = new THREE.Mesh(
				geos.vertCylinder, mats.beam
			);

			beam_ad.castShadow = true;
			beam_ad.receiveShadow = true;

			beam_ad.rotation.x = rad(90)-vals.vertical_angle;
			beam_ad.position.y = vals.tetra_height/2;
			beam_ad.position.z = -(beam_ad.position.y*Math.tan(beam_ad.rotation.x));

			var beam_adp = new THREE.Object3D();
			beam_adp.add(beam_ad);

			tetra.add(beam_adp);

			var beam_bd = beam_ad.clone();
			var beam_bdp = new THREE.Object3D();
			beam_bdp.add(beam_bd);
			beam_bdp.rotation.y = rad(120);

			tetra.add(beam_bdp);

			var beam_cd = beam_ad.clone();
			var beam_cdp = new THREE.Object3D();
			beam_cdp.add(beam_cd);
			beam_cdp.rotation.y = rad(-120);

			tetra.add(beam_cdp);
		// </BEAMS - VERT>

		scene.add(tetra);

		var tetra_b = tetra.clone();
		tetra_b.position.y = 2*vals.tetra_height+30;
		tetra_b.rotation.x = rad(180);

		var tetra_bp = new THREE.Object3D();
		tetra_bp.add(tetra_b);

		scene.add(tetra_bp);

		tetras.bottom = tetra;
		tetras.top = tetra_b;
	};

	var resize = function (width, height) {
		if (!width) {
			width = win.width();
		}

		if (!height) {
			height = win.height();
		}

		config.height = height;
		config.width = width;

		renderer.setSize(width, height);
		cameras.main.aspect = width/height;
		cameras.main.updateProjectionMatrix();
	};

	var domify = function () {
		$("#target").append(renderer.domElement);
	};

	var render = function () {
		renderer.render(scene, cameras.main);
	};

	var sine = 0;

	var tween = function () {
		tetras.top.rotation.y = (tetras.top.rotation.y+0.01)%(2*Math.PI);
		tetras.bottom.rotation.y = (tetras.top.rotation.y-0.005)%(2*Math.PI);

		sine = (sine+1.2)%360;

		tetras.top.position.y = 2*vals.tetra_height+37+(Math.sin(rad(sine))*17);
	};

	var animate = function () {
		if (config.orbit_controls) {
			controls.update();
		}

		tween();
		render();

		requestAnimationFrame(animate);
	};

	var camera = function(x, y, z) {
		if (!x) {
			x = 0;
			y = 180;
			z = 150;
		}

		cameras.main = new THREE.PerspectiveCamera(
			90,
			config.width/config.height,
			0.1,
			3000
		);

		cameras.main.position.z = z;
		cameras.main.position.y = y;
		cameras.main.position.x = x;

		cameras.main.lookAt(new THREE.Vector3(0, 120, 0));
	};

	var init = function(conf) {
		config = unify(config, conf);

		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({
			'precision': 'highp',
			'alpha': true,
			'antialias': true,
			'maxLights': 10
		});

		renderer.shadowMapEnabled = true;


		if (config.axes) {
			var axes = new THREE.AxisHelper(600);
			scene.add(axes);
		}

		meshes();

		tetras.top.castShadow = true;
		tetras.top.receiveShadow = true;

		tetras.bottom.castShadow = true;
		tetras.bottom.receiveShadow = true;

		var geometry = new THREE.PlaneGeometry( 500, 500, 32 );
		var material = new THREE.MeshBasicMaterial({
			color: config.plane_color,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.4
		});

		plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = rad(90);
		plane.receiveShadow = true;

		scene.add( plane );

		buzz(lights);

		domify();

		if (config.orbit_controls) {
			controls = new THREE.OrbitControls(cameras.main);
			controls.damping = 0.2;
			controls.addEventListener('change', render);
		}

		camera();

		resize(config.width, config.height);

		animate();
	};

	return {
		init: init,
		resize: resize,
		camera: camera
	};
})();
