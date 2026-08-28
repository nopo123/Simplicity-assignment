import { RefObject, useEffect, useRef, useState } from "react";

export const useTextTruncation = (
  text: string,
): { textRef: RefObject<HTMLElement>; isTextTruncated: boolean } => {
  const textRef = useRef<HTMLElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  useEffect(() => {
    const checkIfTruncated = () => {
      const element = textRef.current;

      if (element) {
        setIsTextTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkIfTruncated();

    window.addEventListener("resize", checkIfTruncated);

    return () => window.removeEventListener("resize", checkIfTruncated);
  }, [text]);

  return { textRef, isTextTruncated };
};
