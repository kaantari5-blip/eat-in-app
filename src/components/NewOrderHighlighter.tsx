"use client";

import { useEffect } from "react";

export default function NewOrderHighlighter() {
  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes newOrderGlow {
        0% {
          box-shadow: 0 0 0 rgba(201,108,58,0);
          transform: scale(1);
        }
        35% {
          box-shadow: 0 0 32px rgba(201,108,58,0.35);
          transform: scale(1.01);
        }
        100% {
          box-shadow: 0 0 0 rgba(201,108,58,0);
          transform: scale(1);
        }
      }

      .new-order-glow:first-of-type {
        animation: newOrderGlow 1.4s ease-in-out;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}