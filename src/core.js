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
 * Creates a curryable version of a function.
 *
 * The partial functions can be called with any number of arguments. Whenever a sufficient number
 * of arguments is provided the underlying function will be invoked.
 *
 * By default the total number of arguments required is equal to f.length, but this can be overridden
 * by passing in the second argument.
 *
 * Note that this function could be expressed in terms of assistedCurry, but for performance reasons
 * it is not.
 *
 * @param {Function} f The function to curry
 * @param {number} [nrOfArgs] The number of arguments needed to call function `f`. Defaults to `f.length`.
 *
 * :: (t1 -> t2 -> ... -> tn -> r) -> t1 -> t2 -> ... -> tn -> r
 * :: (t1 -> t2 -> ... -> tn -> r) -> Number -> t1 -> t2 -> ... -> t_number -> r
 */
function curry(f, nrOfArgs) {
	//By default we can detect the number of arguments by reading the length property of the function.
	//This should return the number of defined arguments
	if (nrOfArgs === undefined) {
		nrOfArgs = f.length;
	}
	return (...args) => {
		//We allow the curried function to be called with any number of arguments. We collect the arguments
		//passed so far.
		let remaining = nrOfArgs - args.length;
		//When we have enough we call the actual function
		if (remaining <= 0) {
			return f.apply(null, args);
		} else {
			//If we don't have enough we return a new curried function
			return curry((...extraArgs) => {
				let allArgs = args.concat(extraArgs);
				return f.apply(null, allArgs);
			}, remaining);
		}
	};
}

/**
 * Creates a curryable version of a function based on a supplied curryCheck.
 *
 * The function returned by this function will invoke the curryCheck method after every call to a
 * partial function. If the curryCheck returns true the underlying function will be executed.
 *
 * @param {Function} f The function to curry
 * @param {Function} curryCheck A function that should return a truthy value when the arguments gathered
 *                              are sufficient to call the function.
 *
 * :: (t1 -> t2 -> ... -> tn -> r) -> ([*] -> Boolean) -> t1 -> t2 -> ... -> r
 */
let assistedCurry = curry((f, curryCheck) => {
	return (...args) => {
		//If we pass the check we can apply it
		if (curryCheck(args)) {
			return f.apply(null, args);
		} else {
			//If we don't we create a new curried function with a lifted curryCheck. The lifted check will
			//concatenate the existing and new arguments before performing the check.
			return assistedCurry((...extraArgs) => {
				let allArgs = args.concat(extraArgs);
				return f.apply(null, allArgs);
			}, (extraArgs) => {
				let allArgs = args.concat(extraArgs);
				return curryCheck(allArgs);
			});
		}
	};
});
module.exports = {
	identity, i : identity, curry, assistedCurry
};
