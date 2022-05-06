import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
//import 'intersection-observer';

// const normalizeConcatString = str => str.split(/[-_]/).join(" ");

const formatStringToCamelCase = (str) => {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
};

export const getStyleObjectFromString = (str) => {
  //console.log(str);
  const style = {};
  str.split(";").forEach((el) => {
    const [property, value] = el.split(":");
    if (!property) return;

    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  //console.log(style);
  return style;
};
//https://codesandbox.io/s/react-inline-css-to-style-object-drc0r?file=/src/utils/stringUtils.js:0-696
//https://dev.to/qausim/convert-html-inline-styles-to-a-style-object-for-react-components-2cbi

export function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback(() => {
    setValue((v) => !v);
    //console.log('v', value);
  }, []);
  //console.log('value')
  return [value, toggle];
}
//https://www.joshwcomeau.com/snippets/react-hooks/use-toggle/

/*export function throttle(func, timeFrame) {
  var lastTime = 0;
  console.log('thththt');
  return function () {
    //console.log('trrrrrrrrrrrrrrrrr')
    var now = Date.now(); //new Date();
    if (now - lastTime >= timeFrame) {
      func();
      lastTime = now;
    }
  };
}*/


export function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};


export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

//https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectDebugger = (
  effectHook,
  dependencies,
  dependencyNames = []
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency
        }
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    //console.log('[use-effect-debugger] ', changedDeps);
  }

  useEffect(effectHook, dependencies);
};

export function useOnScreen(ref, rootMargin = "0px") {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        //entry => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
        //console.log('entry', entry);
        //console.log('entry.isIntersecting',entry.isIntersecting);
      },
      {
        //root:null,
        //root: document.body,
        // Margin to when element should take action
        rootMargin: rootMargin
        //threshold:0.9
        //root: document.body,
        //threshold: .1
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
      //console.log('inte');
    }
    return () => {
      //console.log('unob');
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}

//https://stackoverflow.com/questions/55187563/determine-which-dependency-array-variable-caused-useeffect-hook-to-fire

export function useTimeout(callback, delay) {
  const timeoutRef = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay]);
  return timeoutRef;
}
//https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/

export const useFirstRender = () => {
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = false;
  }, []);
  console.log("useFirstRender");
  return isMountedRef.current;
};
//https://newbedev.com/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render

export default function useLockBodyScroll() {
  useLayoutEffect(() => {
    // Get original value of body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => (document.body.style.overflow = originalStyle);
  }, []); // Empty array ensures effect is only run on mount and unmount
}
//https://usehooks.com/useLockBodyScroll/

window.addEventListener('resize', () => {
  // vh correction
  let vh = window.innerHeight * 0.01;
  //console.log('vh',vh);
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
//console.log('utils');//1 log
