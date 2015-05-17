let { values, forEach, map, reduce, reduceRight, find } = require('../collection');
let { Just, Nothing } = require('../Maybe');

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

describe('map', () => {

	it('should call it\'s iterator with exactly one argument', () => {
		let isCalled = false;
		map((...args) => {
			isCalled = true;
			args.length.should.equal(1);
		}, [1, 2, 3]);
		isCalled.should.equal(true, 'Iterator was not called');
	});

	it('should call it\'s iterator once with each element in an array', () => {
		let arr = [1, 2, 3];
		let seen = [];
		map((item) => {
			seen.push(item);
		},arr);
		arr.should.eql(seen.sort());
	});

	it('should collect the results of the iterator over an array into a new array', () => {
		let arr = [1, 2, 3];
		let result = map((item) => {
			return item * 2;
		}, arr);
		result.should.eql([2, 4, 6]);
	});

	it('should use an object\'s map property to iterate over it\'s items', () => {
		let obj = {
			map (iterator) {
				var newObj = {};
				newObj.foo = iterator(3);
				return newObj;
			}
		};

		let result = map((item) => item * 2, obj);
		result.foo.should.equal(6);
	});

	it('should throw an error if called on an object with no map property', () => {
		let obj = {
			foo : 1,
			bar : 2
		};
		let seen = [];
		(() =>{ map(seen.push.bind(seen), obj); }).should.throw();
	});

	it('should be curryable', () => {
		let arr = [1, 2, 3];
		let seen = [];
		map((item) => {
			seen.push(item);
		})(arr);
		arr.should.eql(seen.sort());
	});
});

describe('reduce', () => {
	it('should call it\'s iterator with exactly two arguments', () => {
		let isCalled = false;
		reduce((...args) => {
			isCalled = true;
			args.length.should.equal(2);
		}, 0, [1]);
		isCalled.should.equal(true, 'Iterator is not called');
	});

	it('should call the iterator once for each value in the collection in order', () => {
		let collection = [1, 2, 3];
		let seen = [];
		reduce((sum, current) => {
			seen.push(current);
		}, 0, collection);
		seen.should.eql(collection);
	});

	it('should use the final value of the iterator as result value', () => {
		reduce(() => 3, 0, [1]).should.equal(3);
	});

	it('should pass the initialValue to the first iteration', () => {
		let isCalled = false;
		reduce((sum, current) => {
			isCalled = true;
			sum.should.equal(3);
		}, 3, [1]);
		isCalled.should.equal(true, 'Iterator not called');
	});

	it('should pass the return value of an iteration to the next iteration', () => {
		let collection = [1, 2, 3];
		let expectedPartialSums = [
			0,
			1,
			3
		];
		reduce((sum, current) => {
			sum.should.equal(expectedPartialSums.shift());
			return sum + current;
		}, 0, collection);
		expectedPartialSums.length.should.equal(0, 'Iterator not called for every item');
	});

	it('should delegate to an objects reduce method if present', () => {
		let isCalled = false;
		let result = {};
		let subject = {
			reduce(iterator, initialValue) {
				isCalled = true;
				initialValue.should.equal(3);
				return result;
			}
		};
		reduce(() => {}, 3, subject).should.equal(result);
		isCalled.should.equal(true, 'Reduce implementation has not been called');
	});
	it('should throw an error when the subject has no reduce method', () => {
		let subject = {};
		(function() { reduce(() => {}, 0, subject); }).should.throw();
	});

});

describe('reduceRight', () => {
	it('should call it\'s iterator with exactly two arguments', () => {
		let isCalled = false;
		reduceRight((...args) => {
			isCalled = true;
			args.length.should.equal(2);
		}, 0, [1]);
		isCalled.should.equal(true, 'Iterator is not called');
	});

	it('should call the iterator once for each value in the collection in reverse order', () => {
		let collection = [1, 2, 3];
		let seen = [];
		reduceRight((sum, current) => {
			seen.unshift(current);
		}, 0, collection);
		seen.should.eql(collection);
	});

	it('should use the final value of the iterator as result value', () => {
		reduceRight(() => 3, 0, [1]).should.equal(3);
	});

	it('should pass the initialValue to the first iteration', () => {
		let isCalled = false;
		reduceRight((sum, current) => {
			isCalled = true;
			sum.should.equal(3);
		}, 3, [1]);
		isCalled.should.equal(true, 'Iterator not called');
	});

	it('should pass the return value of an iteration to the next iteration', () => {
		let collection = [1, 2, 3];
		let expectedPartialSums = [
			0,
			3,
			5
		];
		reduceRight((sum, current) => {
			sum.should.equal(expectedPartialSums.shift());
			return sum + current;
		}, 0, collection);
		expectedPartialSums.length.should.equal(0, 'Iterator not called for every item');
	});

	it('should delegate to an objects reduceRight method if present', () => {
		let isCalled = false;
		let result = {};
		let subject = {
			reduceRight(iterator, initialValue) {
				isCalled = true;
				initialValue.should.equal(3);
				return result;
			}
		};
		reduceRight(() => {}, 3, subject).should.equal(result);
		isCalled.should.equal(true, 'Reduce implementation has not been called');
	});
	it('should throw an error when the subject has no reduce method', () => {
		let subject = {};
		(function() { reduceRight(() => {}, 0, subject); }).should.throw();
	});
});

describe('find', () => {
	it('should return Maybe.Nothing for an empty collection', () => {
		find(() => true, []).should.equal(Nothing);
	});
	it('should return Maybe.Nothing if the predicate always returns false', () => {
		find(() => false, [1, 2, 3]).should.equal(Nothing);
	});
	it('should return Just(value) for the first value that passes the predicate', () => {
		let result = find((val) => val === 2, [1, 2, 3]);
		result.isJust().should.equal.true;
		result.unsafeGet().should.equal(2);
	});
	it('should be curryable', () => {
		find((val) => val === 2)([1, 2, 3]).isJust().should.equal.true;
	});
});
