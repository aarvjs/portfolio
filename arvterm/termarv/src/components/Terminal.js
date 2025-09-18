import { useState, useEffect, useRef } from 'react';
import Projects from './Projects';
import Education from './Education';
import SoftSkills from './SoftSkills';
import About from './About';
import Internships from './Internships';
import Contact from './Contact';


function Terminal({ onCommand, history }) {
  const [input, setInput] = useState('');
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    onCommand(cmd);
    setInput('');
  };

  const isHelpCommand = (cmd) =>
    ['help', 'show', 'show all'].includes(cmd.trim().toLowerCase());

const getOutput = (cmd, index) => {
  const lowerCmd = cmd.trim().toLowerCase();

  switch (lowerCmd) {
    case 'projects':
      return <Projects key={index} />;
    case 'education':
      return <Education key={index} />;
    case 'about':
      return <About key={index} />;
    case 'softskills':
      return <SoftSkills key={index} />;
    case 'intern':
    case 'internship':
      return <Internships key={index} />;
    case 'contact':
    case 'contacts':
      return <Contact key={index} />;
    case 'email':
      return (
        <p key={index}>
          📧 You can reach me at: <strong>arvind@example.com</strong>
        </p>
      );
    case 'resume':
      return (
        <p key={index}>
          📄 <a href="/Arvind_Resume.pdf" download style={{ color: '#00ffff' }}>Click here to download resume</a>
        </p>
      );
    case 'show all':
      return (
        <div key={index}>
          <About />
          <Education />
          <Projects />
          <SoftSkills />
          <Internships />
          <Contact />
        </div>
      );
    case 'help':
    case 'show':
      return <HelpBlock key={index} />;
    default:
      return (
        <p key={index} style={{ color: 'red' }}>
          Command not found: <code>{cmd}</code>. Type <code>help</code> to see available commands.
        </p>
      );
  }
};

  return (
    <div style={styles.terminal}>
      {!history.some(isHelpCommand) && (
        <div style={styles.typeHelp}>[ Type "help" to get started ]</div>
      )}

      {history.map((cmd, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <div>
            <span style={styles.prefix}>user@arvind:~$</span> {cmd}
          </div>
          {getOutput(cmd, index)}
        </div>
      ))}

      <form onSubmit={handleSubmit} style={styles.form}>
        <span style={styles.prefix}>user@arvind:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          style={styles.input}
        />
      </form>

      <div ref={terminalEndRef} />
    </div>
  );
}

export default Terminal;

// ✅ Help Component Separate for Clean Code
function HelpBlock() {
  return (
    <div style={styles.helpContainer}>
      <div style={styles.commandsSection}>
        <pre style={{ margin: 0 }}>
{`
  Welcome to Arvind's Terminal Portfolio 

  Available commands:
  -------------------
  about        → Know me
  projects     → My project list
  education    → My education background
  softskills   → My soft skills
  internship   → My internships
  resume       → View my resume
  contact      → Contact me
  show all     → Show everything
  clear        → Clear terminal
`}

        </pre>
      </div>
  <div style={styles.logoSection}>
  <pre>
{`
                        ,##,,eew,
                     ,##############C
                  a################@##
                 7####^  ^"7W7"^  @####
                @#@b^             ^@#@^
                 ##^,,,,     ,,,,^## 
               ,,@######"#########==
                ''5555"     "5555b|
                T"@__,,,^mg,,@,* 
                   %p||~~'..#'
                    ^Wp    ,#T
                   :b''@@b^}
                ,^      ' 'b 3-
             .<\\\`  'p   ^v   #   b   *.
          {       }   #"GpGb"   [
         C        3 * @#######Nl   \`
        '       A R V J S   ^@##b     ($   !
`}
  </pre>

  
  <div style={styles.lines}>
    <div style={{ ...styles.line, backgroundColor: '#ff4c4c' }} />
    <div style={{ ...styles.line, backgroundColor: '#4cff4c' }} />
    <div style={{ ...styles.line, backgroundColor: '#4c4cff' }} />
  </div>
<div style={styles.github}>
  <a href="https://github.com/aarvjs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
    [ github ]
  </a>
</div>
</div>

    </div>
  );
}

const styles = {
  terminal: {
    whiteSpace: 'pre-wrap',
    fontSize: '16px',
    color: '#00ff00',
    fontFamily: 'monospace',
    height: '100%',
    overflowY: 'auto',
    padding: '10px',
    position: 'relative',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  prefix: {
    color: '#00ff00',
    marginRight: '5px',
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '16px',
    width: '100%',
    fontFamily: 'monospace',
  },
  typeHelp: {
    color: '#ffaa00',
    fontStyle: 'italic',
    animation: 'blink 1s infinite',
    marginBottom: '1rem',
  },
  helpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  commandsSection: {
    flex: 1,
    color: '#00ff00',
    fontSize: '14px',
  },
 logoSection: {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end', // pushes content to the right
  paddingRight: '40px',
  whiteSpace: 'pre', // ensures ASCII renders correctly
overflow: 'hidden',
  fontFamily: 'monospace',
  fontSize: '10px',
  lineHeight: '12px',
  color: '#fff',

},

github: {
  fontSize: '12px',
  color: '#ff00ff',
  animation: 'blink 1s infinite',
  marginTop: '10px', // Line ke niche thoda gap
},

  lines: {
    marginTop: '4px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '6px',
  },
  line: {
    height: '2px',
    width: '30px',
    borderRadius: '2px',
  },
};

// CSS Animation injected into document
const css = `
@keyframes blink {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}
