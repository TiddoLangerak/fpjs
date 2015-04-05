let { sliceArguments, truncateArguments } = require('../function');

describe('sliceArguments', function() {
	it('should return a function that calls the underlying function with a sliced set of arguments', function() {
		let isCalled = false;
		function targetFunction(...args) {
			isCalled = true;
			args.should.eql([2, 3]);
		}
		let wrappedFunction = sliceArguments(1, 3, targetFunction);
		wrappedFunction(1, 2, 3, 4, 5);
		isCalled.should.equal(true, 'targetFunction should have been called, but it isn\'t');
	});

	it('should slice from the back of the arguments list when negative indices are used', function() {
		let isCalled = false;
		function targetFunction(...args) {
			isCalled = true;
			args.should.eql([2, 3]);
		}
		let wrappedFunction = sliceArguments(-3, -1, targetFunction);
		wrappedFunction(1, 2, 3, 4);
		isCalled.should.equal(true, 'targetFunction should have been called, but it isn\'t');
	});

	it('should allow the end parameter to be omitted', function() {
		let isCalled = false;
		function targetFunction(...args) {
			isCalled = true;
			args.should.eql([2, 3]);
		}
		let wrappedFunction = sliceArguments(1, targetFunction);
		wrappedFunction(1, 2, 3);
		isCalled.should.equal(true, 'targetFunction should have been called, but it isn\'t');
	});

	it('should return a function that returns the return value of the underlying function', function() {
		function targetFunction() {
			return 3;
		}
		let wrappedFunction = sliceArguments(1, targetFunction);
		wrappedFunction(1, 2, 3).should.equal(3);
	});

	it('should be curryable', function() {
		function targetFunction() {
			return 3;
		}
		let wrappedFunction = sliceArguments(1)(targetFunction);
		wrappedFunction(1, 2, 3).should.equal(3);
	});
});

describe('truncateArguments', function() {
	it('should truncate the set of arguments passed to the underlying function', function() {
		let isCalled = false;
		function targetFunction(...args) {
			isCalled = true;
			args.should.eql([2, 3]);
		}
		let wrappedFunction = truncateArguments(2, targetFunction);
		wrappedFunction(2, 3, 4, 5);
		isCalled.should.equal(true, 'targetFunction should have been called, but it isn\'t');
	});

	it('should slice until an offset from the end when a negative index is used', function() {
		let isCalled = false;
		function targetFunction(...args) {
			isCalled = true;
			args.should.eql([1, 2, 3]);
		}
		let wrappedFunction = truncateArguments(-1, targetFunction);
		wrappedFunction(1, 2, 3, 4);
		isCalled.should.equal(true, 'targetFunction should have been called, but it isn\'t');
	});

	it('should return a function that returns the return value of the underlying function', function() {
		function targetFunction() {
			return 3;
		}
		let wrappedFunction = truncateArguments(1, targetFunction);
		wrappedFunction(1, 2, 3).should.equal(3);
	});

	it('should be curryable', function() {
		function targetFunction() {
			return 3;
		}
		let wrappedFunction = truncateArguments(1)(targetFunction);
		wrappedFunction(1, 2, 3).should.equal(3);
	});
});
