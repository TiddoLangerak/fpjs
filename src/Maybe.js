let { extend } = require('./object');
let { identity } = require('./core');
let { notImplemented } = require('./function');

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
	 * :: Maybe a #  b -> (a | b)
	 */
	getOr : notImplemented,
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
};

let Nothing = Object.create(Maybe);
extend(Nothing, {
	isJust: () => false,
	unsafeGet() {
		throw new Error("Maybe.Nothing has no value");
	},
	getOr : identity,
	map : (mapper) => Nothing,
	flatMap : (mapper) => Nothing
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
		map : (mapper) => Just(mapper(value)),
		//TODO: typechecking
		flatMap : (mapper) => mapper(value)
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

