import { MutableRefObject, useEffect, useState } from "react";

export const useHover = (target: MutableRefObject<HTMLElement | null | undefined>) => {
  const [hovering, setHovering] = useState<boolean>(false);

  useEffect(() => {
    if (!target.current) {
      return;
    }

    const handleMouseEnter = () => {
      setHovering(true);
    };
    const handleMouseLeave = () => {
      setHovering(false);
    };

    target.current.addEventListener("mouseenter", handleMouseEnter);
    target.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      target.current && target.current.removeEventListener("mouseleave", handleMouseEnter);
      target.current && target.current.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [target.current]);

  return hovering;
};
