import { useState, useEffect } from 'react';

export const useContainerDimensions = (containerRef, dependencies) => {
  const deps = Array.isArray(dependencies)?dependencies:[];
  const [dimensions, setDimensions] = useState({ width:0, height:0 });
    
  useEffect(()=>{
    if(containerRef !== null ){
      listenToResize();
      window.addEventListener("resize", listenToResize);
    }

    return ()=>window.removeEventListener("resize", listenToResize);
  }, [containerRef, containerRef.current, ...deps]);

  const listenToResize = () => {
      const width = containerRef!==null?(containerRef.current?containerRef.current.clientWidth:0):0;
      const height = containerRef!==null?(containerRef.current?containerRef.current.clientHeight:0):0;
      //console.log(containerRef, width, height);
      setDimensions({width, height});
  }

  return dimensions;
}

export const calculateDimensions = (containerRef) => {

  const width = containerRef!==null?(containerRef.current!==null?containerRef.current.clientWidth:0):0;
  const height = containerRef!==null?(containerRef.current!==null?containerRef.current.clientHeight:0):0;

  return {width, height};
}