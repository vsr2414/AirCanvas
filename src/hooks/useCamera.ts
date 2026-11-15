
import { useEffect, useRef, useState } from "react";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      void videoRef.current.play().catch(() => {
        setError("Unable to play the camera preview.");
      });
    }

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function startCamera() {
    setError("");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera permission was denied. Please allow camera access.");
        } else if (err.name === "NotFoundError") {
          setError("No camera was found on this device.");
        } else {
          setError("Unable to access the camera. Please try again.");
        }
      } else {
        setError("An unexpected camera error occurred.");
      }
    }
  }

  function stopCamera() {
    setStream(null);
  }

  return {
    videoRef,
    isCameraOn: stream !== null,
    error,
    startCamera,
    stopCamera,
  };
}
