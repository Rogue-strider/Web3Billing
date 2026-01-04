import { useEffect, useRef } from "react";

export const useAnimation = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  return elementRef;
};

export default useAnimation;
