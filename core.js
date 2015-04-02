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

module.exports = {
	i : identity,
	identity : identity,
	compose : compose,
	curry : curry
};
