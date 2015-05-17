let { get, set, extend } = require('../object');

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

describe('extend', () => {
	it('should copy all own enumerable properties from source to target', () => {
		let target = {};
		let source = { foo : 3 };
		extend(target, source);
		source.should.have.keys('foo');
		target.foo.should.equal(3);
	});
	it('should not copy non-enumerable properties', () => {
		let target = {};
		let source = {};
		extend(target, source);
		Object.defineProperty(source, 'foo', {});
		Object.keys(target).should.be.empty;
	});
	it('should not copy properties from the prototype', () => {
		let target = {};
		let proto = { foo : 3 };
		let source = Object.create(proto);
		extend(target, source);
		Object.keys(target).should.be.empty;
	});
	it('should be curryable', () => {
		let target = {};
		let source = { foo : 3 };
		extend(target)(source);
		source.should.have.keys('foo');
		target.foo.should.equal(3);
	});
	it('should return target', () => {
		let target = {};
		let source = {};
		extend(target, source).should.equal(target);
	});

});
