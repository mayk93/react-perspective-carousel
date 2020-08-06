import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-use-gesture';
import { animated, useSprings } from 'react-spring';
import debounce from 'lodash.debounce';

const zip = (...arrays) => [...arrays[0]].map((_, index) => arrays.map(array => array[index]));

const splitMiddle = (start, end, total) => {
  const distance = total - start + end;
  const toMiddle = parseInt(distance / 2);

  if (start + toMiddle >= total) {
    return start + toMiddle - total;
  }
  return start + toMiddle;
};

const circularMiddle = (givenStart, givenEnd, total) => {
  const start = givenStart.value !== undefined ? givenStart.value : givenStart;
  const end = givenEnd.value !== undefined ? givenEnd.value : givenEnd;

  const type = end - start > 0 ? 0 : 1;
  return type === 1 ? splitMiddle(start, end, total) : parseInt((start + end) / 2);
};

Array.prototype.circularSlice = function (start, end) {
  if (start < end) {
    return this.slice(start, end);
  }
  return [...this.slice(start, this.length), ...this.slice(0, end)];
};

class CircularNumber {
  constructor ({ start = 0, end = 0, defaultValue = 0 }) {
    this.start = start;
    this.end = end;
    this.value = defaultValue;
  }

  add (value = 1) {
    const { start, end } = this;

    if (this.value + value >= end) {
      this.value = (this.value + value) % end;
    } else if (this.value + value < start) {
      this.value = end - Math.abs((this.value + value) % end);
    } else {
      this.value = this.value + value;
    }
  }

  reset() {
    this.value = 0;
  }
}

// { visible, total, offset }
const springLogicBuilder = ({ start, end, usedVisible, visibleSlidesPercentage }) => {
  const circularX = new CircularNumber({ start, end });

  const fx = index => index;
  const fy = index => {
    const startValue = start.value;
    const endValue = end.value;

    const middle = circularMiddle(start, end, usedVisible);

    if (startValue <= index && index <= middle) {
      return index - startValue;
    } else if (index > middle && index <= endValue) {
      return endValue - index - 1;
    }
    throw Error('This case should not be reached');
  };
  const fz = index => {
    const startValue = start.value;
    const endValue = end.value;
    const middle = circularMiddle(start, end, usedVisible);

    if (index === middle) {
      return 0;
    } else if (startValue <= index && index < middle) {
      return -1 * (middle - index);
    } else if (index > middle && index <= endValue) {
      return -1 * (index - middle);
    }
    return null;
  };
  const fs = index => index === 0 || index === usedVisible - 1 ? 0.1 : 1;

  const scaleX = x => -1 * x * visibleSlidesPercentage;
  const scaleY = y => y * visibleSlidesPercentage;

  // const fd = x => start <= x && x <= end ? 'initial' : 'none';

  const springLogic = index => {
    const x = scaleX(fx(index));
    const y = scaleY(fy(index));
    const z = fz(index);
    const s = fs(index);
    // const display = fd(index);

    console.log('springLogic called with index returns: ', index, { x, y, z, s });

    return {
      x,
      y,
      zIndex: z,
      scale: s,
      immediate: key => key === 'zIndex' ? true : false
    };
  };

  return { springLogic, fx, fy, fz, fs, scaleX, scaleY };
};

const onDragBuilder = ({ index, set, springLogic }) => {
  const onDrag = state => set(springIndex => {
    return springLogic(springIndex)

    // const { movement } = state;
    // const [mx] = movement;
    //
    // const isDraggedCard = index === springIndex;
    // const cardState = springLogic(springIndex);

    // if(isDraggedCard) {
    //   console.log(`Card ${springIndex} is the dragged card`);
    // } else {
    //   console.log(`Card ${springIndex} is NOT the dragged card`);
    // }

    // console.log('index, cardState.x, mx, cardState.x + mx: ', index, cardState.x, mx, cardState.x + mx);

    // return {
    //   ...cardState,
    //   x: cardState.x + mx
    // };

    // return cardState;
  });
  return onDrag;
};

const Card = ({ id, text, computedStyle, dragBind, x, y, zIndex, scale }) => (
  <animated.div
    key={id}
    className="slider-card"
    {...dragBind()}
    style={{ ...computedStyle, x, y, zIndex, scale }}
  >
    {text}
  </animated.div>
);

const Slider = ({ items, visible = 5 }) => {
  const usedVisible = visible % 2 === 0 ? visible - 1 : visible;

  if (visible !== usedVisible) {
    console.warn(`Perspective carousel visible slides must be an odd number, using ${usedVisible} slides`);
  }

  const [{ start, end }, setSliceValues] = useState({
    start: new CircularNumber({ start: 0, end: 0 + usedVisible, defaultValue: 0 }),
    end: new CircularNumber({ start: 0, end: 0 + usedVisible, defaultValue: 0 + usedVisible })
  });
  const [usedItems, setItems] = useState(items.circularSlice(start.value, end.value));

  const visibleSlidesPercentage = 100 / usedVisible;
  const computedStyleCard = { flex: `1 0 ${visibleSlidesPercentage}%` };

  const { springLogic, fx } = springLogicBuilder({
    start, end, usedVisible, visibleSlidesPercentage
  });
  const [springs, set] = useSprings(usedItems.length, springLogic);

  const dragBinds = usedItems.map((_, index) => useDrag(onDragBuilder({ index, set, springLogic })));

  const moveLeft = () => console.log('Left');
  const moveRight = () => console.log('Right');

  return (
    <>
      <div className="slider-container">
        {zip(usedItems, springs, dragBinds).map(([item, spring, dragBind]) => (
          <Card key={item.id} computedStyle={computedStyleCard} dragBind={dragBind} {...item} {...spring} />
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