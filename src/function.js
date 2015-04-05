let { assistedCurry } = require('./core');

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

module.exports = {
	sliceArguments,
	truncateArguments
};
