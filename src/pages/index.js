"use client";
import { useState, useRef, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";

export default function Home() {
  const localVideoRef = useRef(null);
  const muxVideoRef = useRef(null);

  const [localStats, setLocalStats] = useState({
    loadTime: null,
    resolution: "",
  });
  const [muxStats, setMuxStats] = useState({ loadTime: null, resolution: "" });

  const handleLocalLoaded = () => {
    const time = performance.now();
    const res = `${localVideoRef.current.videoWidth}x${localVideoRef.current.videoHeight}`;
    setLocalStats({ loadTime: time, resolution: res });
  };

  const handleMuxLoaded = () => {
    const time = performance.now();
    const res = `${muxVideoRef.current.videoWidth}x${muxVideoRef.current.videoHeight}`;
    setMuxStats({ loadTime: time, resolution: res });
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Video Optimization POC</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Mux Optimized Video */}
        <section>
          <h2>Optimized Video (Mux)</h2>
          <MuxPlayer
            ref={muxVideoRef}
            streamType='on-demand'
            playbackId='EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs'
            metadataVideoTitle='Optimized Video'
            controls
            onLoadedData={handleMuxLoaded}
          />
          {muxStats.loadTime && (
            <p>
              Load Time: {muxStats.loadTime.toFixed(2)} ms <br />
              Resolution: {muxStats.resolution}
            </p>
          )}
        </section>
        {/* Google Drive Uploaded Unoptimized Video */}
        <section>
          <h2>Google Drive Uploaded Unoptimized Local Video</h2>
          <video
            ref={localVideoRef}
            width='640'
            controls
            onLoadedData={handleLocalLoaded}
          >
            <source
              src='https://drive.google.com/uc?id=13ODlJ-Dxrd7aJ7jy6lsz3bwyVW-ncb3v'
              type='video/mp4'
            />
          </video>
          {localStats.loadTime && (
            <p>
              Load Time: {localStats.loadTime.toFixed(2)} ms <br />
              Resolution: {localStats.resolution}
            </p>
          )}
        </section>
        {/* s3 Uploaded Unoptimized Video */}
        <section>
          <h2>S3 Uploaded Unoptimized Local Video</h2>
          <video
            ref={localVideoRef}
            width='640'
            controls
            onLoadedData={handleLocalLoaded}
          >
            <source
              src='https://muxed.s3.amazonaws.com/leds.mp4'
              type='video/mp4'
            />
          </video>
          {localStats.loadTime && (
            <p>
              Load Time: {localStats.loadTime.toFixed(2)} ms <br />
              Resolution: {localStats.resolution}
            </p>
          )}
        </section>
        {/* Local Unoptimized Video */}
        <section>
          <h2>Unoptimized Local Video</h2>
          <video
            ref={localVideoRef}
            width='640'
            controls
            onLoadedData={handleLocalLoaded}
          >
            <source src='/SampleVideo_1280x720_1mb.mp4' type='video/mp4' />
          </video>
          {localStats.loadTime && (
            <p>
              Load Time: {localStats.loadTime.toFixed(2)} ms <br />
              Resolution: {localStats.resolution}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
