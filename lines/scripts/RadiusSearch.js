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