let { values, forEach, map } = require('../collection');

describe('values', () => {
	it('should return all own enumerable properties of an object', () => {
		let obj = {
			foo : 3,
			bar : 4,
			baz : 'foo'
		};
		values(obj).should.eql([3, 4, 'foo']);
	});
	it('should ignore any properties in the prototype', () => {
		let proto = {
			foo : 3,
			bar : 4,
			baz : 'foo'
		};
		values(Object.create(proto)).should.eql([]);
	});
	it('should ignore all non-enumerable properties', () => {
		var obj = {};
		Object.defineProperty(obj, 'foo', { configurable : true, enumerable : false, value : 'foo', writable : true});
		values(obj).should.eql([]);
	});
	it('should return a shallow copy of the values', () => {
		var val = {};
		var obj = {
			val : val
		};
		//Note: equal does identity checking, so we need to use that
		values(obj)[0].should.equal(val);
	});

	it('should return a shallow copy of an array input', () => {
		var val = [1, 2, 3];
		var val2 = values(val);
		val2.should.eql(val);
		val2.should.not.equal(val);
	});

	it('should not include extra enumerable properties of arrays', () => {
		var arr = [];
		arr.foo = 'bar';
		values(arr).should.eql([]);
		values(arr).should.not.containDeep(['bar']);
	});

});

describe('forEach', () => {

	it('should call it\'s iterator with exactly one argument', () => {
		let isCalled = false;
		forEach((...args) => {
			isCalled = true;
			args.length.should.equal(1);
		}, [1, 2, 3]);
		isCalled.should.equal(true, 'Iterator was not called');
	});

	it('should call it\'s iterator once with each element in an array', () => {
		let arr = [1, 2, 3];
		let seen = [];
		forEach((item) => {
			seen.push(item);
		},arr);
		//Note that forEach doesn't need to run in order, so we sort first.
		arr.sort().should.eql(seen.sort());
	});

	it('should use an object\'s forEach property to iterate over it\'s items', () => {
		let obj = {
			forEach (iterator) {
				for (let i = 0; i < 3; i++) {
					iterator(i);
				}
			}
		};

		let seen = [];
		forEach(seen.push.bind(seen), obj);
		seen.sort().should.eql([0, 1, 2]);
	});

	it('should throw when no forEach property is found', () => {
		let obj = {
			foo : 1,
			bar : 2
		};

		let seen = [];
		(() => { forEach(seen.push.bind(seen), obj); }).should.throw();
	});

	it('should be curryable', () => {
		let arr = [1, 2, 3];
		let seen = [];
		forEach((item) => {
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

