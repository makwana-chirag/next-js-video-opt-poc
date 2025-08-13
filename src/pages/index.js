"use client";
import { useState, useRef, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";

export default function Home() {
  const startTimes = useRef({});
  const driveRef = useRef(null);
  const s3Ref = useRef(null);
  const localRef = useRef(null);
  const muxRef = useRef(null);

  const [muxStats, setMuxStats] = useState({ loadTime: null, resolution: "" });
  const [driveStats, setDriveStats] = useState({
    loadTime: null,
    resolution: "",
  });
  const [s3Stats, setS3Stats] = useState({ loadTime: null, resolution: "" });
  const [localStats, setLocalStats] = useState({
    loadTime: null,
    resolution: "",
  });

  // Fallback start time in case onLoadStart is skipped
  useEffect(() => {
    ["mux", "drive", "s3", "local"].forEach((key) => {
      if (!startTimes.current[key]) {
        startTimes.current[key] = performance.now();
      }
    });
  }, []);

  const handleStart = (key) => {
    console.log(`[${key}] Video loading started at:`, performance.now());
    startTimes.current[key] = performance.now();
  };

  const handleLoaded = (key, videoRef, setStats) => {
    try {
      const end = performance.now();
      const startTime = startTimes.current[key] || end;
      const duration = end - startTime;
      console.log(
        `[${key}] Loaded - Start: ${startTime}, End: ${end}, Duration: ${duration}ms`
      );

      const videoElement =
        videoRef?.current?.tagName === "VIDEO" ? videoRef.current : null;
      console.log(`[${key}] Video element found:`, !!videoElement);

      if (videoElement) {
        console.log(`[${key}] Video readyState:`, videoElement.readyState);
        console.log(
          `[${key}] Video dimensions: ${videoElement.videoWidth}x${videoElement.videoHeight}`
        );
        console.log(`[${key}] Video src:`, videoElement.currentSrc);

        const res = `${videoElement.videoWidth}x${videoElement.videoHeight}`;
        setStats({
          loadTime: duration,
          resolution: res || "unknown",
          src: videoElement.currentSrc || "unknown",
        });
      } else {
        console.error(`[${key}] Video element not properly initialized`);
        setStats({
          loadTime: duration,
          resolution: "unknown",
          src: "element-not-found",
        });
      }
    } catch (error) {
      console.error(`[${key}] Error in handleLoaded:`, error);
      setStats({
        loadTime: 0,
        resolution: "error",
        error: error.message,
      });
    }
  };

  useEffect(() => {
    console.log("Component mounted, checking video element...");
    const vid = localRef.current;
    console.log("Video element on mount:", vid);

    if (vid) {
      console.log("Video readyState on mount:", vid.readyState);
      if (vid.readyState >= 1) {
        console.log("Video already loaded, capturing stats...");
        if (!startTimes.current["local"]) {
          startTimes.current["local"] = performance.now();
        }
        handleLoaded("local", localRef, setLocalStats);
      } else {
        console.log("Video not loaded yet, waiting for events...");
      }
    } else {
      console.error("Video ref is null on mount");
    }
  }, []);

  // Log the current state for debugging
  useEffect(() => {
    console.log("localStats updated:", localStats);
  }, [localStats]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Video Optimization POC</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
        }}
      >
        {/* Mux */}
        <section>
          <h2>Optimized Video (Mux)</h2>
          <MuxPlayer
            ref={muxRef}
            streamType='on-demand'
            playbackId='EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs'
            metadataVideoTitle='Optimized Video'
            controls
            onLoadStart={() => handleStart("mux")}
            onLoadedMetadata={(e) => {
              const videoEl = e.target.querySelector("video");
              const res = videoEl
                ? `${videoEl.videoWidth}x${videoEl.videoHeight}`
                : "unknown";
              handleLoaded("mux", { current: videoEl }, setMuxStats);
              setMuxStats((prev) => ({ ...prev, resolution: res }));
            }}
          />
          {muxStats.loadTime && (
            <p>
              Load Time: {muxStats.loadTime.toFixed(2)} ms <br />
              Resolution: {muxStats.resolution}
            </p>
          )}
        </section>

        {/* Drive */}
        {/* <section>
          <h2>Google Drive</h2>
          <video
            ref={driveRef}
            width='640'
            controls
            onLoadStart={() => handleStart("drive")}
            onLoadedMetadata={() =>
              handleLoaded("drive", driveRef, setDriveStats)
            }
          >
            <source
              src='https://drive.google.com/uc?id=13ODlJ-Dxrd7aJ7jy6lsz3bwyVW-ncb3v'
              type='video/mp4'
            />
          </video>
          {driveStats.loadTime && (
            <p>
              Load Time: {driveStats.loadTime.toFixed(2)} ms <br />
              Resolution: {driveStats.resolution}
            </p>
          )}
        </section> */}

        {/* S3 */}
        {/* <section>
          <h2>S3 Video</h2>
          <video
            ref={s3Ref}
            width='640'
            controls
            onLoadStart={() => handleStart("s3")}
            onLoadedMetadata={() => handleLoaded("s3", s3Ref, setS3Stats)}
          >
            <source
              src='https://muxed.s3.amazonaws.com/leds.mp4'
              type='video/mp4'
            />
          </video>
          {s3Stats.loadTime && (
            <p>
              Load Time: {s3Stats.loadTime.toFixed(2)} ms <br />
              Resolution: {s3Stats.resolution}
            </p>
          )}
        </section> */}

        {/* Local */}
        <section>
          <h2>Local Video</h2>
          <video
            ref={localRef}
            width='640'
            controls
            preload='metadata'
            onLoadStart={() => {
              console.log("onLoadStart triggered for local video");
              handleStart("local");
            }}
            onLoadedData={() => {
              console.log("onLoadedData triggered for local video");
              handleLoaded("local", localRef, setLocalStats);
            }}
            onCanPlay={() => {
              console.log("Can play local video");
              if (!localStats.loadTime) {
                handleLoaded("local", localRef, setLocalStats);
              }
            }}
            onError={(e) => {
              console.error("Video error:", e.target.error);
            }}
          >
            <source src='/videos/my_video.mp4' type='video/mp4' />
            Your browser does not support the video tag.
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
