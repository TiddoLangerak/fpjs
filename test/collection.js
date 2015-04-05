let { values } = require('../collection');

describe('values', function() {
	it('should return all own enumerable properties of an object', function() {
		let obj = {
			foo : 3,
			bar : 4,
			baz : 'foo'
		};
		values(obj).should.eql([3, 4, 'foo']);
	});
	it('should ignore any properties in the prototype', function() {
		let proto = {
			foo : 3,
			bar : 4,
			baz : 'foo'
		};
		values(Object.create(proto)).should.eql([]);
	});
	it('should ignore all non-enumerable properties', function() {
		var obj = {};
		Object.defineProperty(obj, 'foo', { configurable : true, enumerable : false, value : 'foo', writable : true});
		values(obj).should.eql([]);
	});
	it('should return a shallow copy of the values', function() {
		var val = {};
		var obj = {
			val : val
		};
		//Note: equal does identity checking, so we need to use that
		values(obj)[0].should.equal(val);
	});

	it('should return a shallow copy of an array input', function() {
		var val = [1, 2, 3];
		var val2 = values(val);
		val2.should.eql(val);
		val2.should.not.equal(val);
	});

	it('should not include extra enumerable properties of arrays', function() {
		var arr = [];
		arr.foo = 'bar';
		values(arr).should.eql([]);
		values(arr).should.not.containDeep(['bar']);
	});

});
