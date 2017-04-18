const _ = require('lodash');

function filterEmptyProps(obj) {
	return _(obj).omitBy(_.isUndefined).omitBy(_.isNull).value();
}

function average(arr) {
	const sum = (memo, num)  => memo + num;
	return _.reduce(arr, sum, 0) / (arr.length === 0 ? 1 : arr.length);
}

function averageBy(arr, prop) {
	return average(arr.map(e => e[prop]));
}

module.exports = {
	filterEmptyProps,
	average,
	averageBy
};