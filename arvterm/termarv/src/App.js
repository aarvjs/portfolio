import { useState } from 'react';
import ImageSection from './components/ImageSection';
import Terminal from './components/Terminal';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);

  const handleCommand = (cmd) => {
    if (cmd === 'clear') {
      setHistory([]);
    } else {
      setHistory([...history, cmd]);
    }
  };

  return (
    <div style={styles.app}>
      <ImageSection />
      <div style={styles.rightSection}>
        <Terminal onCommand={handleCommand} history={history} />
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#00ff00',
    fontFamily: 'monospace',
  },
  rightSection: {
    width: '60%',
    padding: '2rem',
    overflowY: 'auto',
  },
};

export default App;
