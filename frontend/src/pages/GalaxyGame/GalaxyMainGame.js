import React, { useEffect, useRef, useState } from "react";
import { useControls } from "./GalaxyControls";
import { useBackground } from "./GalaxyBackground";
import { loadAssets } from "./assets";

const GalaxyMainGame = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const typedRef = useRef("");
  const assetsRef = useRef({});
  const [gameReady, setGameReady] = useState(false);

  // Player state
  const playerRef = useRef({ x: 0, y: 0, width: 100, height: 80, speed: 300 });

  const { initStars, drawBackground } = useBackground();

  const controls = useControls({
    onTyped: (t) => (typedRef.current = t),
    onBackspace: (t) => (typedRef.current = t),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // prevent page scroll while game is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars(canvas, 160);
      // center player in the middle of the canvas
      playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
      playerRef.current.y = canvas.height / 2 - playerRef.current.height / 2;
    }
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    let last = performance.now();

    // load assets including ship image
    loadAssets({ images: { ship: "/images/nightraider.png" }, sounds: {} })
      .then((loaded) => {
        assetsRef.current = loaded;
        setGameReady(true);
        loop(performance.now());
      })
      .catch((err) => {
        console.error("Failed to load assets:", err);
        setGameReady(true);
        loop(performance.now());
      });

    function updatePlayer(dt) {
      const keys = controls.keysPressed.current;
      const speed = playerRef.current.speed;

      if (keys["ArrowLeft"]) {
        playerRef.current.x = Math.max(0, playerRef.current.x - speed * dt);
      }
      if (keys["ArrowRight"]) {
        playerRef.current.x = Math.min(
          canvas.width - playerRef.current.width,
          playerRef.current.x + speed * dt
        );
      }
      if (keys["ArrowUp"]) {
        playerRef.current.y = Math.max(0, playerRef.current.y - speed * dt);
      }
      if (keys["ArrowDown"]) {
        playerRef.current.y = Math.min(
          canvas.height - playerRef.current.height,
          playerRef.current.y + speed * dt
        );
      }
    }

    function drawPlayer() {
      const p = playerRef.current;
      const shipImg = assetsRef.current.ship;

      if (shipImg) {
        // draw image
        ctx.drawImage(shipImg, p.x, p.y, p.width, p.height);
      } else {
        // fallback: draw a simple rectangle if image not loaded
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
    }

    function loop(now) {
      if (!running) return;
      const dt = (now - last) / 1000;
      last = now;

      // update
      updatePlayer(dt);

      // render
      drawBackground(ctx, canvas);
      drawPlayer();

      // HUD / typed text
      ctx.fillStyle = "white";
      ctx.font = "18px monospace";
      ctx.fillText("Typed: " + typedRef.current, 16, 36);

      animationRef.current = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [initStars, drawBackground, controls]);

  return (
    <div
      style={{
        position: "fixed",
        top: "var(--navbar-height, 64px)",
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", background: "black" }}
      />
      {!gameReady && <div style={{ color: "white", padding: 20 }}>Loading game…</div>}
    </div>
  );
};

export default GalaxyMainGame;