let { extend } = require('./object');
let { identity } = require('./core');
let { notImplemented } = require('./function');

//TODO: currently everything in the Maybe monad is ad-hoc implemented, but this should be done
//properly with the help of type-classes.

let Maybe = {
	/**
	 * Returns true if the maybe object is Nothing
	 * :: Maybe a # () => Boolean
	 */
	isNothing : function() { return !this.isJust(); },
	/**
	 * Returns true if the Maybe object is Just a
	 * :: Maybe a # () => Boolean
	 */
	isJust : function() { return !this.isNothing(); },
	/**
	 * Gets the value or throws if Nothing.
	 * :: Maybe a # () -> Failable a Error
	 */
	unsafeGet : notImplemented,
	/**
	 * Gets the value or returns it's argument when Nothing
	 *
	 * Note that this function does NOT support using a function to generate the other value, like `or` does.
	 * Doing so would result in ambiguity when the Maybe monad captures a function itself.
	 * :: Maybe a #  b -> (a | b)
	 */
	getOr : notImplemented,
	/**
	 * Returns the current Maybe if it is Just, otherwise it returns the other.
	 *
	 * Other may also be a function that generates a maybe object
	 *
	 * :: Maybe a # Maybe b -> Maybe (a | b)
	 * :: Maybe a # (() -> Maybe b) -> Maybe (a | b)
	 */
	or : notImplemented,
	/**
	 * Maps a Maybe onto another Maybe by transforming it's value with the function passed as argument.
	 * :: Maybe a # (a -> b) -> Maybe b
	 */
	map : notImplemented,
	/**
	 * Similar to Map, but it expects the return value of the mapper to return a Maybe. This maybe
	 * will then be returned by the flatMap function.
	 *
	 * Warning: there are no runtime checks to guarantee that the value returned is actually a maybe.
	 *
	 * :: Maybe a # (a -> Maybe b) -> Maybe b
	 */
	flatMap : notImplemented,
	/**
	 * Returns `Just a` iff the filter function returns truthy when called with `a`. Otherwise returns
	 * Nothing.
	 *
	 * :: Maybe a # (a -> Boolean) -> Maybe a
	 */
	filter : notImplemented
};

let Nothing = Object.create(Maybe);
extend(Nothing, {
	isJust: () => false,
	unsafeGet() {
		throw new Error("Maybe.Nothing has no value");
	},
	getOr : identity,
	or : (other) => other instanceof Function ? other() : other,
	map : (mapper) => Nothing,
	flatMap : (mapper) => Nothing,
	filter : (filterFunc) => Nothing
});

let JustProto = Object.create(Maybe);
extend(JustProto, {
	isJust: () => true
});

let Just = (value) => {
	let just = Object.create(JustProto);
	extend(just, {
		unsafeGet : () => value,
		getOr : () => value,
		or : () => just,
		map : (mapper) => Just(mapper(value)),
		//TODO: typechecking
		flatMap : (mapper) => mapper(value),
		filter : (filterFunc) => filterFunc(value) ? just : Nothing
	});
	return just;
};

function fromValue(val) {
	if (val === null || val === undefined) {
		return Nothing;
	} else {
		return Just(val);
	}
}

module.exports = {
	Nothing, Just, fromValue
};

