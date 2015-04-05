let { curry } = require('./core');

/**
 * Gets a property of an object.
 * @param {String} propertyName The name of the property to get
 * @param {Object} object The object to get the property from.
 *
 * :: String -> Object -> Any
 */
let get = curry((propertyName, object) => object[propertyName]);

/**
 * Sets a property on an object.
 *
 * @param {Any} value The value to assign to the property
 * @param {String} propertyName The name of the property to set
 * @param {Object} object The object to set the property on
 *
 * :: Any -> String -> Object -> ()
 */
let set = curry((value, propertyName, object) => object[propertyName] = value);

module.exports = {
	/* jshint ignore:start */
	// jshint doesn't recognize get and set as valid property names. See:
	// https://github.com/jshint/jshint/issues/2288
	get, set
	/* jshint ignore:end */
};
