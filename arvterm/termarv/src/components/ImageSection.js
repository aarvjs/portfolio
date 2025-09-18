import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const App = () => {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const cubeSides = ["React", "Tailwind", "SQL", "Python", "Git", "JavaScript"];

  return (
    <div style={{ position: "relative", width: "50vw", height: "100vh", overflow: "hidden", backgroundColor: "#0f0f0f", fontFamily: "sans-serif" }}>
      <Particles
        init={particlesInit}
        options={{
          background: { color: "#0f0f0f" },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } }
          },
          particles: {
            color: { value: "#ffffff" },
            links: { enable: true, color: "#ffffff", distance: 150 },
            move: { enable: true, speed: 2 },
            number: { value: 50 },
            size: { value: 3 }
          }
        }}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />

      {/* Top Left Profile */}
      <div style={{ position: "absolute", top: 30, left: 30, zIndex: 2, display: "flex", alignItems: "center", gap: 20 }}>
        <img src="https://via.placeholder.com/80" alt="profile" style={{ borderRadius: "50%", border: "2px solid #fff", width: 80, height: 80 }} />
        <div>
          <svg width="200" height="60">
            <text x="0" y="40" fill="white" fontSize="30" fontWeight="bold">Arvind Yadav</text>
          </svg>
          <div style={{ marginTop: 10, display: "flex", gap: 10, color: "white", fontSize: 24 }}>
            <a href="https://github.com/" target="_blank" rel="noreferrer" style={{ color: "#fff" }}><FaGithub /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" style={{ color: "#fff" }}><FaLinkedin /></a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" style={{ color: "#fff" }}><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Center Cube */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        perspective: "1000px",
        width: 200,
        height: 200,
        zIndex: 2
      }}>
        <div style={{
          width: "50%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          animation: "spin 10s infinite linear"
        }}>
          {cubeSides.map((skill, i) => {
            const transforms = [
              "rotateY(0deg) translateZ(100px)",       // Front
              "rotateY(180deg) translateZ(100px)",     // Back
              "rotateY(90deg) translateZ(100px)",      // Right
              "rotateY(-90deg) translateZ(100px)",     // Left
              "rotateX(90deg) translateZ(100px)",      // Top
              "rotateX(-90deg) translateZ(100px)"      // Bottom
            ];

            return (
              <div key={i} style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                border: "2px solid #00ffcc",
                transform: transforms[i],
                transition: "all 0.3s ease-in-out",
              }}>
                {skill}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cube Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default App;
