let { get, set } = require('../object');

describe('get', function() {
	it('should return a property of an object', function() {
		let target = {};
		let obj = { foo : target };
		get('foo', obj).should.equal(target);
	});

	it('should be curryable', function() {
		let obj = { foo : 3 };
		get('foo')(obj).should.equal(3);
	});
});

describe('set', function() {
	it('should set a property on an object', function() {
		let obj = {};
		let target = {};
		set(target, 'foo', obj);
		obj.foo.should.equal(target);
	});

	it('should be curryable', function() {
		let obj = {};
		set(3, 'foo', obj);
		obj.foo.should.equal(3);
	});
});
