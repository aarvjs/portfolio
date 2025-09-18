import React, { useEffect, useRef } from 'react';
import { annotate } from 'rough-notation';

function About() {
  const nameRef = useRef(null);
  const fullStackRef = useRef(null);
  const freelancerRef = useRef(null);
  const blockchainRef = useRef(null);

  useEffect(() => {
    const annotations = [
      annotate(nameRef.current, { type: 'box', color: '#00ff00', animationDuration: 800, padding: 4 }),
      annotate(fullStackRef.current, { type: 'underline', color: '#ffaa00', animationDuration: 800 }),
      annotate(freelancerRef.current, { type: 'circle', color: '#ff00ff', animationDuration: 800 }),
      annotate(blockchainRef.current, { type: 'highlight', color: '#0055ff', animationDuration: 800 }),
    ];
    annotations.forEach((a) => a.show());
  }, []);

  return (
    <div style={{ color: '#00ff00', fontFamily: 'monospace', lineHeight: '1.6', padding: '1rem' }}>
      <h3>[ About Me ]</h3>
      <p>
        <span ref={nameRef}>I’m Arvind Yadav</span>, a BCA student and passionate{' '}
        <span ref={fullStackRef}>Full Stack Developer</span>. I also work as a{' '}
        <span ref={freelancerRef}>Freelancer</span>, building scalable web and mobile applications.
        I specialize in JavaScript, React, React Native, and Java, with hands-on experience in Supabase.
        Additionally, I have a solid understanding of <span ref={blockchainRef}>Blockchain technology</span>.
      </p>
    </div>
  );
}

export default About;
