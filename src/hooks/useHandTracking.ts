
import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

interface HandPoint {
  x: number;
  y: number;
  z: number;
}

export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isCameraOn: boolean,
) {
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isModelReady, setIsModelReady] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [landmarks, setLandmarks] = useState<HandPoint[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function initializeModel() {
      try {
        setError("");

        const vision = await FilesetResolver.forVisionTasks(
          "/mediapipe-wasm",
        );

        const landmarker = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "/models/hand_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          },
        );

        if (cancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setIsModelReady(true);
      } catch {
        if (!cancelled) {
          setError("Unable to load the hand tracking model.");
        }
      }
    }

    void initializeModel();

    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isModelReady || !isCameraOn) {
      return;
    }

    let lastVideoTime = -1;

    function detectHand() {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (
        !video ||
        !landmarker ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        animationRef.current = requestAnimationFrame(detectHand);
        return;
      }

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;

        const results = landmarker.detectForVideo(
          video,
          performance.now(),
        );

        const hand = results.landmarks[0];

        setHandDetected(Boolean(hand));
        setLandmarks(
          hand?.map((point) => ({
            x: point.x,
            y: point.y,
            z: point.z,
          })) ?? [],
        );
      }

      animationRef.current = requestAnimationFrame(detectHand);
    }

    animationRef.current = requestAnimationFrame(detectHand);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isModelReady, isCameraOn, videoRef]);

  return {
    isModelReady,
    handDetected,
    landmarks,
    error,
  };
}
