//Type notes:
//- Inspired by haskell.
//- Type names starting with an upper case are actual type names
//- Type names starting with a lower case are type variables
//- Generic types are defined by `Type typeVariable` (e.g. `List a`)
/**
 * Identity function, returns it's first argument.
 *
 * :: a -> a
 */
function identity(arg) {
	return arg;
}

/**
 * Composes functions together.
 *
 * E.g. f(g(x)) === compose(f, g)(x);
 *
 * Any number of arguments can be passed to the compose function.
 *
 * :: (a -> b) -> (b -> c) -> (a -> c)
 * :: (t_1 -> t_2) -> (t_2 -> t_3) -> ... -> (t_n-1 -> t)n) -> (t_1 -> t_n)
 */
var compose = curry(function(f1, f2) {
	var funcs = [].slice.apply(arguments);
	var last = funcs[funcs.length - 1];
	//The functional way would be to use reduce to construct the composed function. However,
	//that is significantly slower than using a loop (see http://jsperf.com/reduce-vs-iteration-x, I've also
	//tested it with different numbers of functions and arguments. Results are always the same)
	//So therefore we use the less sexy loop instead.
	return function() {
			var args = [].slice.apply(arguments);
			var res = last.apply(null, args);
			for (var i = funcs.length - 2; i >= 0; i--) {
					res = funcs[i](res);
			}
			return res;
	};
});

/**
 * Creates a curryable version of a function.
 *
 * The partial functions can be called with any number of arguments. Whenever a sufficient number
 * of arguments is provided the underlying function will be invoked.
 *
 * By default the total number of arguments required is equal to f.length, but this can be overridden
 * by passing in the second argument.
 *
 * @param {Function} f The function to curry
 * @param {number} [nrOfArgs] The number of arguments needed to call function `f`. Defaults to `f.length`.
 *
 * :: (t1 -> t2 -> ... -> tn -> r) -> t1 -> t2 -> ... -> tn -> r
 */
function curry(f, nrOfArgs) {
	//By default we can detect the number of arguments by reading the length property of the function.
	//This should return the number of defined arguments
	if (nrOfArgs === undefined) {
		nrOfArgs = f.length;
	}
	return function() {
		//We allow the curried function to be called with any number of arguments. We collect the arguments
		//passed so far.
		var args = [].slice.apply(arguments);
		var remaining = nrOfArgs - args.length;
		//When we have enough we call the actual function
		if (remaining <= 0) {
			return f.apply(null, args);
		} else {
			//If we don't have enough we return a new curried function
			return curry(function() {
				var innerArgs = args.concat([].slice.apply(arguments));
				return f.apply(null, innerArgs);
			}, remaining);
		}
	};
}

/**
 * Iterates over a subject.
 *
 * @param {Function} iterator A function to be called with each value of the subject
 * @param {{ forEach }} subject An object that implements a forEach function.
 *
 * :: (a -> () ) -> (ForEach a) -> ()
 */
var forEach = curry(function(iterator, subject) {
	if (!subject.forEach) {
		throw new Error("Subject does not implement the ForEach interface");
	}
	return subject.forEach(compose(iterator, identity));
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
var map = curry(function(iterator, subject) {
	if (!subject.map) {
		throw new Error("Subject does not implement the Map interface");
	}
	return subject.map(compose(iterator, identity));
});

/**
 * Returns all own enumerable values of an object.
 *
 * :: ( { a } ) -> [a]
 */
var values = function(object) {
	//Iterating over the keys is the fastest method, see http://jsperf.com/own-property-iteration
	var props = Object.keys(object);
	return map(function(prop) {
		return object[prop];
	}, props);
};

module.exports = {
	i : identity,
	identity : identity,
	compose : compose,
	curry : curry,
	forEach : forEach,
	map : map,
	values : values
};
