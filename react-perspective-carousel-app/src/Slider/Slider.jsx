import React, { useState } from 'react';
import { useGesture, useDrag } from 'react-use-gesture';
import { useSprings, animated } from 'react-spring';

let originalX = [], originalY = [], originalZ = [];

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

    return { x, y, zIndex: z, display, immediate: key => key === 'zIndex' ? true : false };
  };

  return springLogic;
};

const onDragBuilder = ({ index, items, setItems, spring, set }) => {
  const onDrag = state => set(springIndex => {
    if (springIndex === index) {
      const { down, initial, movement, xy } = state;

      const [ix] = initial;
      const [mx] = movement;
      const [x] = xy;

      const newX = down ? mx + originalX[index] : originalX[index];

      const newState = { x: newX };

      const delta = ix - x;
      const movedLeft = delta > 50;
      const movedRight = delta < -50;

      console.log('initial, movement, xy: ', initial, movement, xy);
      console.log('delta: ', delta);
      console.log({ movedLeft, movedRight });

      if (movedLeft) {
        setItems(shiftLeft(items));
      } else if (movedRight) {
        setItems(shiftRight(items));
      }

      return newState;
    }
  });

  return onDrag;
};
/* End Logic Utils */

/* Start UI Components */
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
  const [usedItems, setItems] = useState([...items]);
  const usedVisible = visible % 2 === 0 ? visible - 1 : visible;
  if (visible !== usedVisible) {
    console.warn(`Perspective carousel visible slides must be an odd number, using ${usedVisible} slides`);
  }

  const visibleSlidesPercentage = 100 / usedVisible;
  const computedStyleCard = { flex: `1 0 ${visibleSlidesPercentage}%` };

  const [springs, set, stop] = useSprings(usedItems.length, springLogicBuilder(
    usedVisible, visibleSlidesPercentage
  ));
  const dragBinds = usedItems.map((item, index) => useDrag(onDragBuilder({
    index,
    set,
    setItems,
    items: usedItems,
    spring: springs[index]
  })));

  return (
    <div className="slider-container">
      {zip(usedItems, springs, dragBinds).map(([item, spring, dragBind]) => (
        <Card key={item.id} computedStyle={computedStyleCard} dragBind={dragBind} {...item} {...spring} />
      ))}
    </div>
  );
};
/* End UI Components */

export default Slider;
