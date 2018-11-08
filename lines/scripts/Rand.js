module.exports = function (min, max) {
	return min+(Math.round(Math.random()*Math.pow(10, Math.floor(Math.log10(max))+1))%(max-min));
};