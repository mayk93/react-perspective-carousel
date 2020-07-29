import React, { useRef, useCallback } from 'react';
import { useGesture } from 'react-use-gesture';
import { useSprings, animated } from 'react-spring';

// const clamp = (value, min, max) => {
//   if (value < min) {
//     return min;
//   } else if (value > max) {
//     return max;
//   }
//   return value;
// };
// const xAxisShift = 2.3;
// const yAxisShift = 5;

// const styles = {
//   container: { position: 'relative', height: '100%', width: '100%' },
//   item: { position: 'absolute', height: '100%', willChange: 'transform' }
// };
//
// /**
//  * Calculates a spring-physics driven infinite slider
//  *
//  * @param {Array} items - display items
//  * @param {Function} children - render child
//  * @param {number} width - fixed item with
//  * @param {number} visible - number of items that muste be visible on screen
//  */
// export default function Slider ({ items, width = 600, visible = 4, style, children }) {
//   const idx = useCallback((x, l = items.length) => (x < 0 ? x + l : x) % l, [items]);
//   const getPos = useCallback((i, firstVis, firstVisIdx) => idx(i - firstVis + firstVisIdx), [idx]);
//   const [springs, set] = useSprings(items.length, i => {
//     const x = (i < items.length - 1 ? i : -1) * width;
//     const y = 0;
//
//     // const y =(i < items.length - 1 ? i : -1) * 10;; // clamp(-Math.pow(x - xAxisShift, 2) + yAxisShift, -100, 100);
//     //
//     // console.log('Setting: ', { x, y });
//
//     return { x, y };
//   });
//   const prev = useRef([0, 1]);
//
//   const runSprings = useCallback(
//     (y, vy) => {
//       const firstVis = idx(Math.floor(y / width) % items.length);
//       const firstVisIdx = vy < 0 ? items.length - visible - 1 : 1;
//       set(i => {
//         const position = getPos(i, firstVis, firstVisIdx);
//         const prevPosition = getPos(i, prev.current[0], prev.current[1]);
//         const rank = firstVis - (y < 0 ? items.length : 0) + position - firstVisIdx;
//         const configPos = vy > 0 ? position : items.length - position;
//         return {
//           x: (-y % (width * items.length)) + width * rank,
//           immediate: vy < 0 ? prevPosition > position : prevPosition < position,
//           config: { tension: (1 + items.length - configPos) * 100, friction: 30 + configPos * 40 }
//         };
//       });
//       prev.current = [firstVis, firstVisIdx];
//     },
//     [idx, getPos, width, visible, set, items.length]
//   );
//
//   const wheelOffset = useRef(0);
//   const dragOffset = useRef(0);
//   const bind = useGesture({
//     onDrag: ({ offset: [x], vxvy: [vx] }) => vx && ((dragOffset.current = -x), runSprings(wheelOffset.current + -x, -vx)),
//     onWheel: ({ offset: [, y], vxvy: [, vy] }) => vy && ((wheelOffset.current = y), runSprings(dragOffset.current + y, vy))
//   });
//
//   return (
//     <div {...bind()} style={{ ...style, ...styles.container }}>
//       {springs.map((springProps, i) => {
//         // console.log('Spring props: ', springProps);
//         const { x, y } = springProps;
//         return (
//           <a.div key={i} style={{ ...styles.item, width, x, y }} children={children(items[i], i)}/>
//         );
//       })}
//     </div>
//   );
// }

const zip = (arr1, arr2) => arr1.map((item, index) => [item, arr2[index]]);

const springLogicBuilder = length => {
  let zIndex = 0;
  const middle = length / 2;

  console.log('length/2 or middle: ', middle);

  const getZIndex = () => {
    const newZIndex = zIndex;
    zIndex = zIndex - 1;
    return newZIndex;
  }

  const springLogic = index => {
    console.log(`For length ${length} - index ${index} * 33 ( ${index * 33} ): `, length - index * 33);

    const x = -index * 33; // 33 is width?
    const y = index < middle ? index * 33 : (length - index - 1) * 33; // -1 might be based on odd / even
    const z = index < middle ? 0 : index === middle ? 1 : getZIndex();

    return { x, y, z };
  };

  return springLogic;
};

const Card = ({ id, text, x, y, z }) => (
  <animated.div className="slider-card" key={id} style={{ x, y, z }}>
    {text}
  </animated.div>
);

const Slider = ({ items }) => {
  const [springs, set, stop] = useSprings(items.length, springLogicBuilder(items.length));

  return (
    <div className="slider-container">
      {zip(items, springs).map(([item, spring]) => <Card {...item} {...spring} />)}
    </div>
  );
};

export default Slider;
