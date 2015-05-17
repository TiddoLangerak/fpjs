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

/**
 * Copies all values from source to target.
 *
 * :: a -> b -> (a = a & b, a) (Note: this means that whatever a was, it's now a & b. Additionally, a is returned)
 */
let extend = curry((target, source) => {
	Object.keys(source)
		.forEach((key) => target[key] = source[key]);
	return target;
});

module.exports = {
	get, set, extend
};
