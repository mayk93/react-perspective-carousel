// class CircularNumber {
//   constructor ({ start = 0, end = 0, defaultValue = 0 }) {
//     this.start = start;
//     this.end = end;
//     this.value = defaultValue;
//   }
//
//   add (value = 1) {
//     const { start, end } = this;
//
//     if (this.value + value >= end) {
//       this.value = (this.value + value) % end;
//     } else if (this.value + value < start) {
//       this.value = end - Math.abs((this.value + value) % end);
//     } else {
//       this.value = this.value + value;
//     }
//   }
// }
//
// module.exports = CircularNumber;

const splitMiddle = (start, end, total) => {
  const distance = total - start + end;
  const toMiddle = parseInt(distance / 2);

  if (start + toMiddle >= total) {
    return start + toMiddle - total;
  }
  return start + toMiddle;
};

module.exports = splitMiddle;
