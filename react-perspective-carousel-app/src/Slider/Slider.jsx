import React, { useState, useEffect } from 'react';
import { useGesture, useDrag } from 'react-use-gesture';
import { animated, interpolate, useSprings } from 'react-spring';
import debounce from 'lodash.debounce';

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
// const springLogicBuilder = ({ visible, total, offset, visibleSlidesPercentage }) => {
//   let start = offset;
//   let end = (offset + visible) % total - 1;
//
//   if (start > end) {
//     end = [start, start = end][0];
//   }
//
//   const middle = (start + end) / 2;
//
//   const fx = x => start <= x && x <= end ? x - offset : null;
//   const fy = x => {
//     if (start <= x && x <= middle) {
//       return x - offset;
//     } else if (x > middle && x <= end) {
//       return end - x;
//     }
//     return null;
//   };
//   const fz = x => {
//     if (x === middle) {
//       return 0;
//     } else if (start <= x && x < middle) {
//       return -1 * (middle - x);
//     } else if (x > middle && x <= end) {
//       return -1 * (x - middle);
//     }
//     return null;
//   };
//   const fd = x => start <= x && x <= end ? 'initial' : 'none';
//
//   const springLogic = index => {
//     const x = fx(index);
//     const y = fy(index);
//     const z = fz(index);
//     const display = fd(index);
//
//     const realX = -1 * visibleSlidesPercentage * x;
//     const realY = visibleSlidesPercentage * y;
//
//     return {
//       x: realX,
//       y: realY,
//       zIndex: z,
//       scale: 1,
//       display,
//       immediate: key => key === 'zIndex' ? true : false
//     };
//   };
//
//   return { springLogic, fx, fy, fz, fd };
// };
/* End Logic Utils */

/* Start UI Components */
// dragBind
// {...dragBind()}
//  x, y, zIndex, scale, display
// x, y, zIndex, scale, display
const Card = ({ id, text, computedStyle }) => (
  <animated.div
    key={id}
    className="slider-card"
    style={{ ...computedStyle }}
  >
    {text}
  </animated.div>
);

/* End UI Components */
const Slider = ({ items, visible = 5 }) => {
  const usedVisible = visible % 2 === 0 ? visible - 1 : visible;

  if (visible !== usedVisible) {
    console.warn(`Using ${usedVisible}`);
  }

  const [start, setStart] = useState(0);
  const [usedItems, setItems] = useState(items.slice(start, start + usedVisible));

  const visibleSlidesPercentage = 100 / usedVisible;
  const computedStyleCard = { flex: `1 0 ${visibleSlidesPercentage}%` };

  // const { springLogic, fx, fy, fz, fd } = springLogicBuilder({
  //   visible: usedVisible, total: usedItems.length, visibleSlidesPercentage, offset: 0
  // });
  // const [springs, set] = useSprings(usedItems.length, springLogic);
  //

  const shiftLogic = value => () => {
    const rawStart = (start + value) % usedVisible;
    const newStart = rawStart < 0 ? usedVisible - rawStart : rawStart;
    const newEnd = newStart + usedVisible;

    setStart(newOffset);
    setItems(items.slice(newStart, newEnd));
  };
  const moveLeft = debounce(shiftLogic(1), 100);
  const moveRight = debounce(shiftLogic(-1), 100);
  //
  // // Lots of work to do on this one
  // const yMovement = ({ oldY, mx, dx, dampen, index, target }) => {
  //   const middle = parseInt(usedVisible / 2);
  //   const draggedLeft = dx < 0;
  //   const draggedRight = dx > 0;
  //   if (index === middle) {
  //     if (draggedLeft) {
  //       return clamp(oldY + mx * dampen, 0, oldY);
  //     } else if (draggedRight) {
  //       return clamp(oldY - mx * dampen, 0, oldY);
  //     }
  //     return fy(target);
  //   } else if (index < middle) {
  //     return 0;
  //   } else {
  //     return 0;
  //   }
  // };

  // I think this needs isRange as well
  // const dChange = (t, d) => 0 + d <= t && t <= 5 + d ? 'initial' : 'none';

  // const onDragBuilder = ({ index }) => {
  //   const onDrag = state => set(springIndex => {
  //     // down
  //     const { dragging, movement, direction, elapsedTime } = state;
  //     const [mx] = movement;
  //     const [dx] = direction;
  //
  //     const dampen = elapsedTime / (1500 * visibleSlidesPercentage * 2);
  //     const stepsMoved = clamp(parseInt(mx * dampen), -usedVisible, usedVisible);
  //     const target = clamp(
  //       stepsMoved < 0 ? usedVisible + stepsMoved : index + stepsMoved,
  //       0,
  //       usedVisible - 1
  //     );
  //
  //     const oldState = springLogic(index);
  //     const targetState = springLogic(target);
  //     const otherCardState = springLogic(springIndex);
  //
  //     if (index === springIndex) {
  //       if (dragging) {
  //         return {
  //           ...oldState,
  //           x: oldState.x + mx,
  //           y: yMovement({ oldY: oldState.y, mx, dx, dampen, index, target }),
  //           zIndex: dragging ? 10 : fz(index),
  //           scale: dragging ? 1.3 : 1
  //         };
  //       } else {
  //         console.log('Target ', target, ' state: ', targetState);
  //         return targetState;
  //       }
  //     }
  //     return otherCardState;
  //   });
  //   return onDrag;
  // };

  // const dragBinds = usedItems.map((_, index) => useDrag(onDragBuilder({ index })));

  // springs, dragBinds
  return (
    <>
      <div className="slider-container">
        {zip(usedItems).map(([item]) => (
          <Card key={item.id} computedStyle={computedStyleCard} {...item} />
        ))}
      </div>
      <br/><br/><br/>
      <button onClick={moveLeft}>
        Shift Left
      </button>
      <button onClick={moveRight}>
        Shift Right
      </button>
    </>
  );
};

export default Slider;
