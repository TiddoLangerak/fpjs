let { compose, identity, i, curry, forEach, map } = require('../core');

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

describe('forEach', function() {

	it('should call it\'s iterator with exactly one argument', function() {
		let isCalled = false;
		forEach(function() {
			isCalled = true;
			arguments.length.should.equal(1);
		}, [1, 2, 3]);
		isCalled.should.equal(true, 'Iterator was not called');
	});

	it('should call it\'s iterator once with each element in an array', function() {
		let arr = [1, 2, 3];
		let seen = [];
		forEach(function(item) {
			seen.push(item);
		},arr);
		//Note that forEach doesn't need to run in order, so we sort first.
		arr.sort().should.eql(seen.sort());
	});

	it('should use an object\'s forEach property to iterate over it\'s items', function() {
		let obj = {
			forEach : function(iterator) {
				for (let i = 0; i < 3; i++) {
					iterator(i);
				}
			}
		};

		let seen = [];
		forEach(seen.push.bind(seen), obj);
		seen.sort().should.eql([0, 1, 2]);
	});

	it('should throw when no forEach property is found', function() {
		let obj = {
			foo : 1,
			bar : 2
		};

		let seen = [];
		(function() { forEach(seen.push.bind(seen), obj); }).should.throw();
	});

	it('should be curryable', function() {
		let arr = [1, 2, 3];
		let seen = [];
		forEach(function(item) {
			seen.push(item);
		})(arr);
		//Note that forEach doesn't need to run in order, so we sort first.
		arr.sort().should.eql(seen.sort());
	});
});

describe('map', function() {

	it('should call it\'s iterator with exactly one argument', function() {
		let isCalled = false;
		map(function() {
			isCalled = true;
			arguments.length.should.equal(1);
		}, [1, 2, 3]);
		isCalled.should.equal(true, 'Iterator was not called');
	});

	it('should call it\'s iterator once with each element in an array', function() {
		let arr = [1, 2, 3];
		let seen = [];
		map(function(item) {
			seen.push(item);
		},arr);
		arr.should.eql(seen.sort());
	});

	it('should collect the results of the iterator over an array into a new array', function() {
		let arr = [1, 2, 3];
		let result = map(function(item) {
			return item * 2;
		}, arr);
		result.should.eql([2, 4, 6]);
	});

	it('should use an object\'s map property to iterate over it\'s items', function() {
		let obj = {
			map : function(iterator) {
				var newObj = {};
				newObj.foo = iterator(3);
				return newObj;
			}
		};

		let result = map(function(item) { return item * 2; }, obj);
		result.foo.should.equal(6);
	});

	it('should throw an error if called on an object with no map property', function() {
		let obj = {
			foo : 1,
			bar : 2
		};
		let seen = [];
		(function(){ map(seen.push.bind(seen), obj); }).should.throw();
	});

	it('should be curryable', function() {
		let arr = [1, 2, 3];
		let seen = [];
		map(function(item) {
			seen.push(item);
		})(arr);
		arr.should.eql(seen.sort());
	});
});

