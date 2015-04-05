let { curry } = require('./core');
let { compose, truncateArguments } = require('./function');

let singleArgument = truncateArguments(1);

/**
 * Iterates over a subject.
 *
 * @param {Function} iterator A function to be called with each value of the subject
 * @param {{ forEach }} subject An object that implements a forEach function.
 *
 * :: (a -> () ) -> (ForEach a) -> ()
 */
let forEach = curry((iterator, subject) => {
	if (!subject.forEach) {
		throw new Error("Subject does not implement the ForEach interface");
	}
	return subject.forEach(singleArgument(iterator));
});

/**
 * Maps an object using an iterator function.
 *
 * @param {Function} iterator A function that maps one value to another.
 * @param {{ map }} subject An object that implements a map function.
 *
 * Map (a -> b) c : An object with a map function that uses an iterator of type (a -> b) to create
 *                  an object of type c.
 * :: (a -> b) -> (Map (a -> b) c) -> c
 */
let map = curry((iterator, subject) => {
	if (!subject.map) {
		throw new Error("Subject does not implement the Map interface");
	}
	return subject.map(singleArgument(iterator));
});

/**
 * Returns all own enumerable values of an object.
 *
 * Note: when an array is given as input this function will just return a shallow copy of its input and NOT all
 * own enumerable values. This might seem inconsistent, but there are several reasons to do so:
 * - In virtually all (reasonable) use cases this is exactly the same behaviour as return all enumerable
 *   values. Making directly a shallow copy is a lot faster.
 * - The goal of this method is to transform a collection type into an array of values. Extra enumerable
 *   properties set on an array are no part of the collection, so (arguably) they don't belong in the output.
 * - Only copying enumerable values would discard empty values in sparse arrays, which is (arguably)
 *   unwanted behaviour.
 *
 * :: ( { a } ) -> [a]
 * :: ( [a] ) -> [a]
 */
let values = (object) => {
	if (object instanceof Array) {
		return object.slice();
	}
	//Iterating over the keys is the fastest method, see http://jsperf.com/own-property-iteration
	let props = Object.keys(object);
	return map((prop) => {
		return object[prop];
	}, props);
};


module.exports = {
	values, forEach, map
};
