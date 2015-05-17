let Maybe = require('../Maybe');
let { Nothing, Just } = Maybe;

describe('Maybe', () => {
	describe('isJust', () => {
		it('should return false for the Nothing Maybe', () => {
			Nothing.isJust().should.be.false;
		});
		it('should return true for any Just value', () => {
			Just(3).isJust().should.be.true;
		});
	});

	describe('isNothing', () => {
		it('should return true for the Nothing Maybe', () => {
			Nothing.isNothing().should.be.true;
		});
		it('should return false for any Just value', () => {
			Just(3).isNothing().should.be.false;
		});
	});

	describe('unsafeGet', () => {
		it('should return the contained value for a Just Maybe', () => {
			let val = {};
			Just(val).unsafeGet().should.equal(val);
		});
		it('should throw an error when called on the Nothing Maybe', () => {
			Nothing.unsafeGet.should.throw();
		});
	});

	describe('getOr', () => {
		it('should return the contained value for the Just Maybe', () => {
			let val = {};
			Just(val).getOr(4).should.equal(val);
		});
		it('should return its argument for the Nothing Maybe', () => {
			Nothing.getOr(4).should.equal(4);
		});
	});

	describe('or', () => {
		it('should return itself for the Just Maybe', () => {
			let val = {};
			let m = Just(val);
			m.or(Just(3)).should.equal(m);
		});
		it('should return its argument for the Nothing Maybe', () => {
			let m = Just(3);
			Nothing.or(m).should.equal(m);
		});
	});


	describe('map', () => {
		it('should return Nothing when called on Nothing', () => {
			Nothing.map(() => 4).should.equal(Nothing);
		});
		it('should map the value of a Just Maybe', () => {
			Just(3).map(() => 4).unsafeGet().should.equal(4);
		});
		it('should result in a nested Maybe when the map function returns a Maybe', () => {
			let innerMaybe = Just(4);
			Just(3).map(() => innerMaybe).unsafeGet().should.equal(innerMaybe);
		});
	});

	describe('flatMap', () => {
		it('should return Nothing if the map function returns Nothing', () => {
			Just(3).flatMap(() => Nothing).should.equal(Nothing);
		});
		it('should return the value returned from the callback', () => {
			let innerMaybe = Just(4);
			Just(3).flatMap(() => innerMaybe).should.equal(innerMaybe);
		});
	});

	describe('fromValue', () => {
		it('should return the Nothing Maybe when called with null', () => {
			Maybe.fromValue(null).should.equal(Nothing);
		});
		it('should return the Nothing Maybe when called with undefined', () => {
			Maybe.fromValue(undefined).should.equal(Nothing);
		});
		it('should return Just 0 when called with 0', () => {
			Maybe.fromValue(0).unsafeGet().should.equal(0);
		});
		it('should return Just {obj} when called with {obj}', () => {
			let obj = {};
			Maybe.fromValue(obj).unsafeGet().should.equal(obj);
		});
	});
});
