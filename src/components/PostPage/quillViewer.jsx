import styles from "./PostPage.module.css";

import { useEffect, useRef } from "react";

// katex
import katex from "katex";
import "katex/dist/katex.min.css";
window.katex = katex;

// Quill
import Quill from "quill";

export default function Viewer({ ref, defaultValue }) {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    const container = containerRef.current;
    const viewerContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );
    const quill = new Quill(viewerContainer, {
      readOnly: true,
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div className={styles.viewer} ref={containerRef}></div>;
}
