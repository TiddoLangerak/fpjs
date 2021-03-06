let { assistedCurry, curry } = require('./core');

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
let compose = curry(function(...funcs) {
	let last = funcs[funcs.length - 1];
	//The functional way would be to use reduce to construct the composed function. However,
	//that is significantly slower than using a loop (see http://jsperf.com/reduce-vs-iteration-x, I've also
	//tested it with different numbers of functions and arguments. Results are always the same)
	//So therefore we use the less sexy loop instead.
	return (...args) => {
			let res = last.apply(null, args);
			for (let i = funcs.length - 2; i >= 0; i--) {
					res = funcs[i](res);
			}
			return res;
	};
}, 2);

/**
 * Creates a function that slices the arguments before applying them to the underlying function.
 * e.g. sliceArguments(2, 4, (a, b) => [a, b])(1, 2, 3, 4); //=> [3, 4]
 *
 * The behaviour of sliceArguments is similar to the behaviour of Array.prototype.slice.
 *
 * @param {Number} start The start index from where to slice
 * @param {Number} [end] The end index of where to slice to
 * @param {Function} f The function to call with the sliced arguments
 *
 * :: Number -> Number -> (t1 -> t2 -> ... -> tn -> r) -> (t1-start -> t2-start -> ... -> tn-end -> r)
 * :: Number -> (t1 -> t2 -> ... -> tn -> r) -> (t1-start -> t2-start -> ... -> tn-start -> r)
 */
let sliceArguments = assistedCurry((start, end, f) => {
	if (!f) {
		f = end;
		end = undefined;
	}
	return (...args) => {
		args = args.slice(start, end);
		return f.apply(this, args);
	};
}, (args) => args[args.length - 1] instanceof Function);

/**
 * Creates a function that truncates an argument list before calling the wrapped function
 *
 * This function is equal to `sliceArguments` with start index 0.
 *
 * @param {Number} howMany The number of arguments to keep
 * @param {Function} f The function to wrap.
 */
let truncateArguments = sliceArguments(0);

/**
 * Function that throws immediately with the message "Function not implemented"
 */
let notImplemented = () => { throw new Error("Function not implemented"); };

module.exports = {
	sliceArguments,
	truncateArguments,
	compose,
	notImplemented
};
