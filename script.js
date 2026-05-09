/* =====================================================================
   DARK / LIGHT MODE TOGGLE
   ===================================================================== */

let mode = document.querySelector(".day-night-mode");

mode.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    mode.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    mode.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
});


/* =====================================================================
   TYPING TEXT ANIMATION
   ===================================================================== */

function startTypingAnimation(selector, strings) {
  new Typed(selector, {
    strings: strings,
    typeSpeed: 100,
    backSpeed: 60,
    loop: true,
  });
}
startTypingAnimation(".typing-2", ["Student", "Web Developer", "Programmer", "Freelancer"]);
startTypingAnimation(".typing",   ["Student", "Web Developer", "Programmer", "Freelancer"]);


/* =====================================================================
   AGE TIMER
   ===================================================================== */

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const now = new Date();

  let years   = now.getFullYear() - birthDate.getFullYear();
  let months  = now.getMonth()    - birthDate.getMonth();
  let days    = now.getDate()     - birthDate.getDate();
  let hours   = now.getHours()    - birthDate.getHours();
  let minutes = now.getMinutes()  - birthDate.getMinutes();
  let seconds = now.getSeconds()  - birthDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--;   }
  if (hours   < 0) { hours   += 24; days--;    }
  if (days    < 0) {
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
    months--;
  }
  if (months  < 0) { months  += 12; years--;   }

  return { years, months, days, hours, minutes, seconds };
}

function padZero(n) { return n < 10 ? `0${n}` : n; }

function updateAge() {
  const age = calculateAge('2005-10-02T05:27:00');
  document.getElementById('y').innerText  = padZero(age.years);
  document.getElementById('mo').innerText = padZero(age.months);
  document.getElementById('d').innerText  = padZero(age.days);
  document.getElementById('h').innerText  = padZero(age.hours);
  document.getElementById('mi').innerText = padZero(age.minutes);
  document.getElementById('s').innerText  = padZero(age.seconds);
}

setInterval(updateAge, 1000);
updateAge();


/* =====================================================================
   CONTACT FORM → WHATSAPP INTEGRATION
   ===================================================================== */

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = (document.getElementById('cname')?.value    || '').trim();
    const email   = (document.getElementById('cemail')?.value   || '').trim();
    const message = (document.getElementById('cmessage')?.value || '').trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields before sending.');
      return;
    }

    const waText =
      `Hello Arvind,%0A` +
      `My Name: ${encodeURIComponent(name)}%0A` +
      `Email: ${encodeURIComponent(email)}%0A%0A` +
      `${encodeURIComponent(message)}%0A%0A` +
      `Interested in working with A Cube Technology.`;

    const waURL = `https://wa.me/919140130314?text=${waText}`;
    window.open(waURL, '_blank');
  });
}


/* =====================================================================
   ACTIVE SECTION HIGHLIGHT IN SIDEBAR (Intersection Observer)
   ===================================================================== */

(function () {
  // Map section IDs to nav hrefs
  const sectionToNav = {
    'home'         : '#home',
    'about'        : '#about',
    'projects'     : '#projects',
    'skills'       : '#skills',
    'certificates' : '#certificates',
    'education'    : '#education',
    'contact'      : '#contact',
  };

  const navLinks = document.querySelectorAll('.nav ul li');

  function setActive(sectionId) {
    const href = sectionToNav[sectionId];
    if (!href) return;

    navLinks.forEach(li => {
      const a = li.querySelector('a');
      if (a && a.getAttribute('href') === href) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }

  const sections = document.querySelectorAll('section[id], div[id]');
  const visibleSections = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Pick the most visible section
      let bestId = null;
      let bestRatio = 0;
      visibleSections.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestId) setActive(bestId);
    },
    {
      root      : document.querySelector('.sections'), // scroll container
      threshold : [0.15, 0.3, 0.5, 0.7],
    }
  );

  sections.forEach(sec => {
    if (sectionToNav[sec.id]) observer.observe(sec);
  });

  // Set home active on load
  setActive('home');
})();


/* =====================================================================
   PREMIUM SMOOTH DOT CURSOR
   Runs alongside existing bracket cursor & ripple — does NOT replace them
   ===================================================================== */

(function () {
  // Don't run on touch-only devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-dot-cursor';
  document.body.appendChild(dot);

  let dotX = window.innerWidth  / 2;
  let dotY = window.innerHeight / 2;
  let curDotX = dotX;
  let curDotY = dotY;
  const dotEase = 0.12; // smooth lag — lower = more trail

  window.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
  });

  window.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  window.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });

  // Grow on interactive elements
  const interactiveSelectors = 'a, button, input, textarea, select, label, [role="button"]';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('cursor-hover'));
  });

  function animateDot() {
    curDotX += (dotX - curDotX) * dotEase;
    curDotY += (dotY - curDotY) * dotEase;
    dot.style.transform = `translate(${curDotX}px, ${curDotY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateDot);
  }
  animateDot();
})();
