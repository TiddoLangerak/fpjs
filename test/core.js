let { compose, identity, i, curry, assistedCurry } = require('../core');
let { map } = require('../collection');

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

describe('assistedCurry', function() {
	function spreadMap(...args) {
		let iterator = args.pop();
		return map(iterator, args);
	}

	function curryCheck(args) {
		return args[args.length - 1] instanceof Function;
	}

	function timesTwo (x) {
		return x * 2;
	}

	let curried = assistedCurry(spreadMap, curryCheck);

	it('should call the underlying function when the initial arguments pass the curryCheck', function() {
		curried(1, 2, timesTwo).should.eql([2, 4]);
	});
	it('should call the underlying function when the curried arguments pass the curryCheck', function() {
		curried(1)(2)(timesTwo).should.eql([2, 4]);
	});

	it('should call the curryCheck for each curried call', function() {
		let callCount = 0;
		let curried = assistedCurry(() => {}, () => { callCount++; return false; });
		curried(1)(2)(3);
		callCount.should.equal(3);
	});

	it('should call the curry check with the accumulated array of arguments', function() {
		let expectedArguments = [
			[1],
			[1, 2],
			[1, 2, 3]
		];
		let curried = assistedCurry(() => {}, (args) => {
			args.should.eql(expectedArguments.shift());
		});
		curried(1)(2)(3);
		expectedArguments.length.should.equal(0, "Curry check has not been called enough times");
	});

	it('should not call the underlying function if the check does not succeed', function() {
		let isCalled = false;
		let currried = assistedCurry(() => isCalled = true, () => false);
		curried(1)(2)(3);
		isCalled.should.equal(false, 'Function has been called when it should not');
	});

	it('should call the underlying function with all arguments passed', function() {
		let isCalled = false;
		let calledArgs;
		let curried = assistedCurry((...args) => {
			isCalled = true;
			calledArgs = args;
		}, curryCheck);
		curried(1, 2, 3, timesTwo);
		isCalled.should.equal(true, 'Function should have been called, but it hasn\'t');
		calledArgs.should.eql([1, 2, 3, timesTwo], 'Function has been called with the wrong arguments');
	});

});

