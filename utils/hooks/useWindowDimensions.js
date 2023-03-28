import { useState, useEffect } from 'react';

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width:0, height:0 });
    
  useEffect(()=>{
    listenToResize();
    window.addEventListener("resize", listenToResize);

    return ()=>window.removeEventListener("resize", listenToResize);
  }, []);

  const listenToResize = () => {
      //const { visualViewport:{ width }, visualViewport:{height} } = window;
      //const {innerWidth: width, innerHeight: height} = window;
      const width = window.innerWidth?window.innerWidth:window.visualViewport.width;
      const height = window.innerHeight?window.innerHeight:window.visualViewport.height;
      setWindowDimensions({ width, height });
  }

  return windowDimensions;
}