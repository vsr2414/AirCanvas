
import { useMemo } from "react";

interface HandPoint {
  x: number;
  y: number;
  z: number;
}

export function usePinchGesture(landmarks: HandPoint[]) {
  return useMemo(() => {
    if (landmarks.length !== 21) {
      return false;
    }

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    const distance = Math.hypot(
      thumbTip.x - indexTip.x,
      thumbTip.y - indexTip.y,
      thumbTip.z - indexTip.z,
    );

    return distance < 0.05;
  }, [landmarks]);
}
