import React from 'react';

function Projects() {
  return (
    <div style={styles.container}>
      {/* Left Terminal-Style Section */}
      <div style={styles.left}>
        <h3 style={styles.heading}>Projects</h3>

        <div style={styles.projectBlock}>
          <p><strong>#1 AllenInside – Student Local Market</strong></p>
          <p>A student marketplace to buy/sell notes, books, and assignments.</p>
          <p>GitHub: <a href="#" style={styles.link}>https://github.com/aarvjs</a></p>
          <p>Live: <a href="#" style={styles.link}>https://alleninside.vercel.app</a></p>
        </div>

        <div style={styles.projectBlock}>
          <p><strong>#2 Jarvis – Voice Assistant</strong></p>
          <p>Voice-controlled assistant that responds to commands and performs tasks.</p>
          <p>GitHub: <a href="#" style={styles.link}>https://github.com/arvind/jarvis</a></p>
          <p>Live: <a href="#" style={styles.link}>https://jarvis-ai.vercel.app</a></p>
        </div>

        <div style={styles.projectBlock}>
          <p><strong>#3 Responsive Portfolio</strong></p>
          <p>Personal portfolio website with animations and responsive layout.</p>
          <p>GitHub: <a href="#" style={styles.link}>https://github.com/arvind/portfolio</a></p>
          <p>Live: <a href="#" style={styles.link}>https://arvind-portfolio.vercel.app</a></p>
        </div>
      </div>

      {/* Right Flowchart with Horizontal Lines & Tech Stack */}
      <div style={styles.right}>
        <h4 style={styles.flowHeading}>Tech Stack</h4>
        <div style={styles.flowChart}>
          {renderFlow("Frontend", "React, Tailwind CSS, Bootstrap")}
          {renderFlow("Backend", "Node.js, Express.js")}
          {renderFlow("Database", "MongoDB, MySQL")}
          {/* {renderFlow("API", "REST APIs, OpenWeatherMap")} */}
          {/* {renderFlow("Hosting", "Vercel, Netlify")} */}
        </div>
      </div>
    </div>
  );
}

// Reusable Flow Row
const renderFlow = (label, techs) => {
  return (
    <div style={styles.flowRow}>
      <div style={styles.verticalLine}></div>
      <div style={styles.flowLabel}>{label}</div>
      <div style={styles.horizontalLine}></div>
      <div style={styles.techText}>{techs}</div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    // backgroundColor: '#000',/
    color: '#00ff00',
    fontFamily: 'monospace',
    padding: '20px',
    gap: '20px',
  },
  left: {
    flex: '1 1 60%',
    minWidth: '300px',
  },
  right: {
    flex: '1 1 35%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
    borderBottom: '1px solid #00ff00',
    paddingBottom: '5px',
  },
  projectBlock: {
    marginBottom: '20px',
    borderBottom: '1px dashed #00ff00',
    paddingBottom: '10px',
  },
  link: {
    color: '#00ffff',
    textDecoration: 'none',
  },
  flowHeading: {
    fontSize: '18px',
    marginBottom: '10px',
    borderBottom: '1px solid #00ff00',
  },
  flowChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
  },
  flowRow: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  verticalLine: {
    width: '2px',
    height: '40px',
    backgroundColor: '#00ff00',
    marginRight: '10px',
    marginLeft: '5px',
  },
  horizontalLine: {
    height: '2px',
    width: '30px',
    background: 'repeating-linear-gradient(to right, #00ff00, #00ff00 5px, transparent 5px, transparent 10px)',
    animation: 'blinkLine 1s infinite linear',
    margin: '0 10px',
  },
  flowLabel: {
    minWidth: '80px',
  },
  techText: {
    color: '#00ffff',
    whiteSpace: 'nowrap',
    fontSize: '14px',
  },

  // Animations using @keyframes inside JS-in-CSS
  '@keyframes blinkLine': {
    from: { backgroundPosition: '0 0' },
    to: { backgroundPosition: '100% 0' },
  },
};

export default Projects;
