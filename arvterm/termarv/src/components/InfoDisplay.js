import Projects from './Projects';
import Education from './Education';
import SoftSkills from './SoftSkills';
import About from './About';

function InfoDisplay({ command }) {
  switch (command) {
    case 'projects':
      return <Projects />;
    case 'education':
      return <Education />;
    case 'softskills':
      return <SoftSkills />;
    case 'about':
      return <About />;
    case 'show all':
      return (
        <>
          <About />
          <Education />
          <Projects />
          <SoftSkills />
        </>
      );
    default:
      return <p>Available commands: about, education, projects, softskills, show all</p>;
  }
}

export default InfoDisplay;
