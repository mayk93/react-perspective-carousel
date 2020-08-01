import React, { useState, useEffect } from 'react';
import { useGesture, useDrag } from 'react-use-gesture';
import { useSprings, animated } from 'react-spring';

// let originalX = [], originalY = [], originalZ = [];

/* Start Utils */
const shiftLeft = (array, shiftBy = 1) => array = array.concat(array.splice(0, shiftBy));
const shiftRight = (array, shiftBy = 1) => shiftLeft(array, array.length - shiftBy);
const zip = (...arrays) => [...arrays[0]].map((_, index) => arrays.map(array => array[index]));
const clamp = (value, min, max) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};
/* End Utils */

/* Start Logic Utils */
const springLogicBuilder = ({ visible, total, offset, visibleSlidesPercentage }) => {
  let start = offset;
  let end = (offset + visible) % total - 1;

  if (start > end) {
    end = [start, start = end][0];
  }

  const middle = (start + end) / 2;

  const fx = x => start <= x && x <= end ? x - offset : null;
  const fy = x => {
    if (start <= x && x <= middle) {
      return x - offset;
    } else if (x > middle && x <= end) {
      return end - x;
    }
    return null;
  };
  const fz = x => {
    if (x === middle) {
      return 0;
    } else if (start <= x && x < middle) {
      return -1 * (middle - x);
    } else if (x > middle && x <= end) {
      return -1 * (x - middle);
    }
    return null;
  };
  const fd = x => start <= x && x <= end ? 'initial' : 'none';

  const springLogic = index => {
    const x = fx(index);
    const y = fy(index);
    const z = fz(index);
    const display = fd(index);

    const realX = -1 * visibleSlidesPercentage * x;
    const realY = visibleSlidesPercentage * y;

    console.log({ x, y, z, display, realX, realY });

    return { x: realX, y: realY, zIndex: z, display, immediate: key => key === 'zIndex' ? true : false };
  };

  return { springLogic, fx, fy, fz, fd };
};

// const onDragBuilder = ({ index, items, setItems, spring, set }) => {
//   const onDrag = state => set(springIndex => {
//     if (springIndex === index) {
//       const { down, initial, movement, xy } = state;
//
//       const [ix] = initial;
//       const [mx] = movement;
//       const [x] = xy;
//
//       const newX = down ? mx + originalX[index] : originalX[index];
//
//       const newState = { x: newX };
//
//       const delta = ix - x;
//       const movedLeft = delta > 50;
//       const movedRight = delta < -50;
//
//       console.log('initial, movement, xy: ', initial, movement, xy);
//       console.log('delta: ', delta);
//       console.log({ movedLeft, movedRight });
//
//       if (movedLeft) {
//         setItems(shiftLeft(items));
//       } else if (movedRight) {
//         setItems(shiftRight(items));
//       }
//
//       return newState;
//     }
//   });
//
//   return onDrag;
// };
/* End Logic Utils */

/* Start UI Components */
const Card = ({ id, text, computedStyle, x, y, zIndex, display }) => (
  <animated.div
    key={id}
    className="slider-card"
    style={{ x, y, zIndex, display, ...computedStyle }}
  >
    {text}
  </animated.div>
);

const Slider = ({ items, visible = 5 }) => {
  console.log('Slider');
  // const [usedItems, setItems] = useState([...items]);

  const [offset, setOffset] = useState(0);
  const usedVisible = visible % 2 === 0 ? visible - 1 : visible;
  if (visible !== usedVisible) {
    console.warn(`Perspective carousel visible slides must be an odd number, using ${usedVisible} slides`);
  }

  const visibleSlidesPercentage = 100 / usedVisible;
  const computedStyleCard = { flex: `1 0 ${visibleSlidesPercentage}%` };

  // const offset = 4 % items.length;

  const { springLogic, fx, fy, fz, fd } = springLogicBuilder({
    visible: usedVisible, total: items.length, visibleSlidesPercentage, offset
  });
  const [springs, set] = useSprings(items.length, springLogic);

  useEffect(
    () => {
      set(index => springLogic(index));
    }, // console.log('Effect called, springLogic, set: ', springLogic, fx, fy, fz, fd)
    [offset]
  );

  // const dragBinds = usedItems.map((item, index) => useDrag(onDragBuilder({
  //   index,
  //   set,
  //   setItems,
  //   items: usedItems,
  //   spring: springs[index]
  // })));

  console.log('Slider offset: ', offset);

  return (
    <>
      <div className="slider-container">
        {zip(items, springs).map(([item, spring]) => (
          <Card key={item.id} computedStyle={computedStyleCard} {...item} {...spring} />
        ))}
      </div>
      <button onClick={() => setOffset((offset + 1) % items.length)}>
        Increase Offset
      </button>
    </>
  );
};
/* End UI Components */

export default Slider;
