let { compose, identity, i } = require('../../core');

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
});
