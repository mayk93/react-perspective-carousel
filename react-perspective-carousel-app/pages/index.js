// import Head from 'next/head';
import Slider from '../src/Slider';
// import { useSprings, animated } from 'react-spring';

const items = [
  {
    id: 0,
    css: 'url(https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 150,
    text: 'Item 1'
  },
  {
    id: 1,
    css: 'url(https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
    text: 'Item 2'
  },
  {
    id: 2,
    css: 'url(https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
    text: 'Item 3'
  },
  {
    id: 3,
    css: 'url(https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
    text: 'Item 4'
  },
  {
    id: 4,
    css: 'url(https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
    text: 'Item 5'
  },
  {
    id: 5,
    css: 'url(https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
    text: 'Item 6'
  },
  {
    id: 6,
    css: 'url(https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
    text: 'Item 7'
  },
  {
    id: 7,
    css: 'url(https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
    text: 'Item 8'
  },
  {
    id: 8,
    css: 'url(https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
    text: 'Item 9'
  },
  {
    id: 9,
    css: 'url(https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 400,
    text: 'Item 10'
  },
  {
    id: 10,
    css: 'url(https://images.pexels.com/photos/911758/pexels-photo-911758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
    text: 'Item 11'
  },
  // {
  //   css: 'url(https://images.pexels.com/photos/249074/pexels-photo-249074.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
  //   height: 150
  // },
  // {
  //   css: 'url(https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
  //   height: 400
  // },
  // {
  //   css: 'url(https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
  //   height: 200
  // }
];

// export default function Home () {
//   return (
//     <div style={{ height: '400px' }}>
//       <Slider items={items} width={700} visible={3}>
//         {({ css }, i) => (
//           <div style={{
//             width: '100 %',
//             height: '100%',
//             padding: '70px 100px'
//           }}>
//             <span style={{
//               color: 'white',
//               position: 'absolute',
//               top: '0px',
//               left: '140px',
//               'font-family': 'monospace'
//             }}>
//               {String(i).padStart(2, '0')}
//             </span>
//             <animated.div style={{
//               width: '100%',
//               height: '100%',
//               'background-size': 'cover',
//               'background-position': 'center center',
//               'background-image': css
//             }}/>
//           </div>
//         )}
//       </Slider>
//     </div>
//   );
// }

export default function Home () {
  return (
    <>
      {/*<div>Only 3 visible</div>*/}
      {/*<Slider items={items} visible={3}/>*/}
      {/*<br />*/}
      {/*<div>Only 5 visible</div>*/}
      {/*<Slider items={items} visible={5}/>*/}
      {/*<br />*/}
      {/*<div>Only 7 visible</div>*/}
      {/*<Slider items={items} visible={7}/>*/}
      {/*<br />*/}
      {/*<div>Only 9 visible</div>*/}
      {/*<Slider items={items} visible={9}/>*/}
      {/*<br />*/}
      <div>Only 6 visible</div>
      <Slider items={items} visible={6}/>
      <br />
      {/*<div>Only 8 visible</div>*/}
      {/*<Slider items={items} visible={8}/>*/}
    </>
  )
}