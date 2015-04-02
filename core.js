/**
 * Identity function, returns it's first argument.
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

var forEach = curry(function(iterator, subject) {
	if (subject.forEach) {
		return subject.forEach(compose(iterator, identity));
	} else {
		//Getting the keys first and using that to iterate over the object is faster than
		//for..in with hasOwnProperty and also faster than keys.forEach in most browsers.
		//The exception is the current stable version of Firefox (36), but in the current dev version (38)
		//this method is also the fastest.
		//See also http://jsperf.com/own-property-iteration
		var keys = Object.keys(subject);
		for (var i = 0; i < keys.length; i++) {
			iterator(subject[keys[i]]);
		}
	}
});

module.exports = {
	i : identity,
	identity : identity,
	compose : compose,
	curry : curry,
	forEach : forEach
};
