const _ = require('lodash');

function filterEmptyProps(obj){
	return _(obj).omitBy(_.isUndefined).omitBy(_.isNull).value();
}

module.exports = { filterEmptyProps } ;