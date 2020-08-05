const { CircularNumber } = require('./array-rotator');

console.log('');
console.log('-----');
let result;
const number = new CircularNumber({
  start: 0,
  end: 10,
  defaultValue: 0
});
console.log('CircularNumber({ start: 0, end: 10, defaultValue: 0 }): ', number);

console.log('-> number.value: ', number.value);

number.add();
result = number.value;
if (result !== 1) { throw(Error('Test 1 failed')); }
console.log('-> number.value after add(1): ', number.value);

number.add(9);
result = number.value;
if (result !== 0) { throw(Error('Test 2 failed')); }
console.log('-> number.value after add(9): ', number.value);

number.add(13);
result = number.value;
if (result !== 3) { throw (Error('Test 3 failed')); }
console.log('-> number.value after add(13): ', number.value);

number.add(-1);
result = number.value;
if (result !== 2) { throw (Error('Test 4 failed')); }
console.log('-> number.value after add(-1): ', number.value);

number.add(-5);
result = number.value;
if (result !== 7) { throw (Error(`Test 5 failed - Expected 7, got ${number.value}`)); }
console.log('-> number.value after add(-5): ', number.value);

number.add(-7);
result = number.value;
if (result !== 0) { throw (Error(`Test 6 failed - Expected 0, got ${number.value}`)); }
console.log('-> number.value after add(-7): ', number.value);

number.add(9);
result = number.value;
if (result !== 9) { throw (Error(`Test 7 failed - Expected 9, got ${number.value}`)); }
console.log('-> number.value after add(9): ', number.value);

for (let i = 0; i < 35; i++) {
  number.add();
  console.log(`Value after doing add for the ${i} time: `, number.value);
}

for (let i = 0; i < 35; i++) {
  number.add(-1);
  console.log(`Value after doing add(-1) for the ${i} time: `, number.value);
}

for (let i = 0; i < 35; i++) {
  number.add(i);
  console.log(`Value after doing add(${i}): `, number.value);
}

console.log('-----');
console.log('');