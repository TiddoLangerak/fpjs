let { compose, identity, i, curry} = require('../core');

describe('identity', function() {
	it('should return it\'s argument', function() {
		let input = {};
		identity(input).should.equal(input);
	});
	it('should ignore any additional parameters', function() {
		let input = {};
		let extra = {};
		identity(input, extra).should.equal(input);
	});
});

describe('i', function() {
	it('should be an alias for identity', function() {
		i.should.equal(identity);
	});
});

describe('compose', function() {
	function plusOne(x) {
		return x + 1;
	}
	function timesTwo(x) {
		return x * 2;
	}

	it('should return a function', function() {
		compose(i, i).should.type('function');
	});

	it('should hold that compose(plusOne, timesTwo)(x) === plusOne(timesTwo(x))', function() {
		let value = 35;
		compose(plusOne, timesTwo)(value).should.equal(plusOne(timesTwo(value)));
	});

	it('should hold that compose(plusOne, timesTwo, plusOne)(x) === plusOne(timesTwo(plusOne(x)))', function() {
		let value = 35;
		compose(plusOne, timesTwo, plusOne)(value).should.equal(plusOne(timesTwo(plusOne(value))));
	});

	it('should be curryable with 2 arguments', function() {
		let andOne = compose(plusOne);
		andOne(timesTwo)(3).should.equal(plusOne(timesTwo(3)));
	});
});

describe('curry', function() {
	function foo(x, y, z) {
		return z;
	}
	let curried = curry(foo);

	it('should return a curried version of its input function', function() {
		curried(1)(2)(3).should.equal(3);
	});

	it('should allow the curried function to be called with multiple arguments at a time', function() {
		curried(1, 2)(3).should.equal(3);
	});

	it('should allow the curried function to be called with all arguments directly', function() {
		curried(1, 2, 3).should.equal(3);
	});

	it('should allow the number of arguments to be specified manually', function() {
		let curried4 = curry(foo, 4);
		curried4(1)(2)(3)(4).should.equal(3);
	});

	it('should not care abut additional arguments in the last call', function() {
		curried(1, 2)(3, 4, 5, 6).should.equal(3);
	});

	it('should allow partial functions to be reused', function() {
		let partial = curried(1, 2);
		partial(3).should.equal(3);
		partial(4).should.equal(4);
	});
});