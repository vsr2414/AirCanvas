
import { useMemo } from "react";

interface HandPoint {
  x: number;
  y: number;
  z: number;
}

export function useFingertip(landmarks: HandPoint[]) {
  return useMemo(() => {
    if (landmarks.length !== 21) {
      return null;
    }

    const tip = landmarks[8];

    return {
      x: 1 - tip.x,
      y: tip.y,
      z: tip.z,
    };
  }, [landmarks]);
}
