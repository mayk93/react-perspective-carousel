import React, { useRef, useCallback } from 'react';
import { useGesture, useDrag } from 'react-use-gesture';
import { useSprings, animated } from 'react-spring';

const clamp = (value, min, max) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};

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

let originalX = [], originalY = [], originalZ = [];

const zip = (...arrays) => [...arrays[0]].map((_, index) => arrays.map(array => array[index]));

const springLogicBuilder = (visible, visibleSlidesPercentage) => {
  let zIndex = 0;
  const middle = visible / 2;

  const getZIndex = () => {
    const newZIndex = zIndex;
    zIndex = zIndex - 1;
    return newZIndex;
  };

  const springLogic = index => {
    const x = -index * visibleSlidesPercentage;
    const y = index < middle ? index * visibleSlidesPercentage : (visible - index - 1) * visibleSlidesPercentage;
    const z = index === parseInt(middle) ? 1 : index < middle ? 0 : getZIndex();
    const display = index < visible ? 'initial' : 'none';

    originalX[index] = x;
    originalY[index] = y;
    originalZ[index] = z;

    return { x, y, scale: 1, zIndex: z, display, immediate: key => key === 'zIndex' ? true : false };
  };

  return springLogic;
};

const onDragBuilder = ({ index, set, spring }) => {
  const onDrag = state => set(springIndex => {
    if (springIndex === index) {
      const { down, movement, xy } = state;
      const [mx, my] = movement;

      const newX = down ? mx + originalX[index] : originalX[index];
      // const newY = down ? clamp(
      //   my || originalY[index],
      //   originalY[index] - 10,
      //   originalY[index] + 10
      // ) : originalY[index];
      const newZ = down ? 10 : originalZ[index];
      const newScale = down ? 1 : 5;

      const newState = { x: newX, zIndex: newZ, scale: newScale }; // y: newY

      return newState;
    }
  });

  return onDrag;
};

const Card = ({ id, text, computedStyle, dragBind, x, y, zIndex, display }) => (
  <animated.div
    key={id}
    className="slider-card"
    style={{ x, y, zIndex, display, ...computedStyle }}
    {...dragBind()}
  >
    {text}
  </animated.div>
);

const Slider = ({ items, visible = 5 }) => {
  const usedVisible = visible % 2 === 0 ? visible - 1 : visible;
  if (visible !== usedVisible) {
    console.warn(`Perspective carousel visible slides must be an odd number, using ${usedVisible} slides`);
  }

  const visibleSlidesPercentage = 100 / usedVisible;
  const computedStyleCard = { flex: `1 0 ${visibleSlidesPercentage}%` };

  const [springs, set, stop] = useSprings(items.length, springLogicBuilder(
    usedVisible, visibleSlidesPercentage
  ));
  const dragBinds = items.map((item, index) => useDrag(onDragBuilder({ index, set, spring: springs[index] })));

  return (
    <div className="slider-container">
      {zip(items, springs, dragBinds).map(([item, spring, dragBind]) => (
        <Card key={item.id} computedStyle={computedStyleCard} dragBind={dragBind} {...item} {...spring} />
      ))}
    </div>
  );
};

export default Slider;
