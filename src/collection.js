let { curry } = require('./core');
let { compose, truncateArguments } = require('./function');
let { Just, Nothing } = require('./Maybe');

let singleArgument = truncateArguments(1);

/**
 * Iterates over a subject.
 *
 * @param {Function} iterator A function of type (a -> *) to be called with each value of the subject
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
 * @param {Function} iterator A function of type (a -> b) that maps one value to another.
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
 * Reduces a collection using an iterator function starting at the first element.
 *
 * @param {Function} iterator A function of type (b -> a -> b) that reduces a collection to a value
 * @param {*} initialValue The initial value to start working with
 * @param {{ reduce }} subject An object that implements the reduce function
 *
 * :: (b -> a -> b) -> b -> Reduce a -> b
 */
let reduce = curry((iterator, initialValue, subject) => {
	if (!subject.reduce) {
		throw new Error("Subject does not implement the Reduce interface");
	}
	return subject.reduce(truncateArguments(2, iterator), initialValue);
});

/**
 * Reduces a collection using an iterator function starting at the last element.
 *
 * @param {Function} iterator A function of type (b -> a -> b) that reduces a collection to a value
 * @param {*} initialValue The initial value to start working with
 * @param {{ reduceRight }} subject An object that implements the reduce function
 *
 * :: (b -> a -> b) -> b -> ReduceRight a -> b
 */
let reduceRight = curry((iterator, initialValue, subject) => {
	if (!subject.reduceRight) {
		throw new Error("Subject does not implement the ReduceRight interface");
	}
	return subject.reduceRight(truncateArguments(2, iterator), initialValue);
});

/**
 * Finds the first item for which the predicate returns true.
 * @param {Function} predicate The predicate that will be called with each item in the collection
 * @param {{ reduce }} collection An object that implements the reduce function.
 *
 * :: (a -> Boolean) -> Reduce a -> Maybe a
 */
let find = curry((predicate, collection) =>
	reduce((result, current) =>
				 result.or(() => Just(current).filter(predicate)),
				 Nothing,
				 collection)
);

let all = curry((predicate, collection) =>
								//TODO: implement not function
	find((val) => !predicate(val), collection)
);

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
	values, forEach, map, reduce, reduceRight, find
};
