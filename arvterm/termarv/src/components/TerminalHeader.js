import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TerminalHeader = () => {
  const logoRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { scale: 0.8, rotate: 0, opacity: 0 },
      {
        scale: 1,
        rotate: 360,
        opacity: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      }
    );
  }, []);

  return (
    <div style={styles.header}>
      <svg
        ref={logoRef}
        width="50"
        height="50"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.logo}
      >
        <path
          d="M50 5 C65 15, 85 30, 70 50 C90 60, 60 90, 30 75 C10 60, 20 30, 50 5 Z"
          fill="#00ff00"
        />
      </svg>
      <h2 style={styles.title}>Arvind's Terminal</h2>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  logo: {
    filter: 'drop-shadow(0 0 4px #00ff00)',
  },
  title: {
    color: '#00ff00',
    fontFamily: 'monospace',
    fontSize: '20px',
    margin: 0,
  },
};

export default TerminalHeader;
