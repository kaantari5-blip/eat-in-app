"use client";

import { useEffect, useRef } from "react";

export default function NewOrderSound({ orderCount }: { orderCount: number }) {
  const previousCountRef = useRef(orderCount);
  const unlockedRef = useRef(false);

  useEffect(() => {
    function unlockSound() {
      unlockedRef.current = true;
      window.removeEventListener("click", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    }

    window.addEventListener("click", unlockSound);
    window.addEventListener("keydown", unlockSound);

    return () => {
      window.removeEventListener("click", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, []);

  useEffect(() => {
    if (orderCount > previousCountRef.current && unlockedRef.current) {
      const audio = new Audio("/sounds/new-order.mp3");
      audio.play().catch(() => {});
    }

    previousCountRef.current = orderCount;
  }, [orderCount]);

  return null;
}