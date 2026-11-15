
import "./App.css";
import { useCamera } from "./hooks/useCamera";

function App() {
  const {
    videoRef,
    isCameraOn,
    error,
    startCamera,
    stopCamera,
  } = useCamera();

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <h1>AirCanvas</h1>
            <p>Draw beyond the screen</p>
          </div>
        </div>

        <div className="status">
          <span className={`status-dot ${isCameraOn ? "connected" : ""}`} />
          {isCameraOn ? "Camera connected" : "Camera disconnected"}
        </div>
      </header>

      <section className="workspace">
        <aside className="toolbar">
          <button className="tool active" title="Brush">✎</button>
          <button className="tool" title="Eraser">⌫</button>
          <button className="tool" title="Undo">↶</button>
          <button className="tool" title="Clear">✕</button>
        </aside>

        <section className="canvas-panel">
          <div className="panel-heading">
            <div>
              <h2>Your creative space</h2>
              <p>Move your hand and bring your ideas to life.</p>
            </div>
            <span className="canvas-label">CANVAS</span>
          </div>

          <div className="drawing-area">
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>Your canvas awaits</h3>
              <p>Hand tracking and drawing are coming next.</p>
            </div>
          </div>

          <div className="canvas-footer">
            <span>Ready to create</span>
            <span>AirCanvas · Workspace</span>
          </div>
        </section>

        <aside className="camera-panel">
          <div className="panel-heading">
            <div>
              <h2>Camera preview</h2>
              <p>Live webcam view</p>
            </div>
            <span className="camera-indicator">
              {isCameraOn ? "LIVE" : "OFF"}
            </span>
          </div>

          <div className="camera-preview">
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
              hidden={!isCameraOn}
            />

            {!isCameraOn && (
              <div className="camera-placeholder">
                <span>◎</span>
                <p>Your camera preview will appear here.</p>
              </div>
            )}
          </div>

          <div className="camera-info">
            <span className={`status-dot ${isCameraOn ? "connected" : ""}`} />
            {isCameraOn ? "Camera is running" : "Waiting for camera connection"}
          </div>

          {error && <p className="camera-error">{error}</p>}

          <button
            className="connect-button"
            onClick={isCameraOn ? stopCamera : startCamera}
          >
            {isCameraOn ? "Disconnect camera" : "Connect camera"}
          </button>
        </aside>
      </section>

      <footer className="footer">
        <span>AirCanvas © 2026</span>
        <span>Powered by creativity and machine learning</span>
      </footer>
    </main>
  );
}

export default App;
