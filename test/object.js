let { get, set } = require('../object');

describe('get', () => {
	it('should return a property of an object', () => {
		let target = {};
		let obj = { foo : target };
		get('foo', obj).should.equal(target);
	});

	it('should be curryable', () => {
		let obj = { foo : 3 };
		get('foo')(obj).should.equal(3);
	});
});

describe('set', () => {
	it('should set a property on an object', () => {
		let obj = {};
		let target = {};
		set(target, 'foo', obj);
		obj.foo.should.equal(target);
	});

	it('should be curryable', () => {
		let obj = {};
		set(3, 'foo', obj);
		obj.foo.should.equal(3);
	});
});
