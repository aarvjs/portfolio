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

/* =====================================================================
   DYNAMIC PROJECTS GRID & MODAL REDESIGN
   ===================================================================== */

const projectsData = [
  {
    name: "FacultyJobs",
    category: "Recruitment Platform",
    liveUrl: "https://facultyjobs.org/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React", "Node.js", "REST API", "Auth"],
    features: [
      "Candidate & Recruiter Portals",
      "AI Resume Extraction & Matching",
      "Job Discovery & Application Tracking",
      "Interview Scheduling & Email Workflows",
      "Role-Based Dashboards & REST APIs"
    ],
    status: "Live",
    projectType: "Professional Hiring Platform",
    description: "Professional hiring and recruitment platform with candidate portals, AI resume extraction, and REST API integrations.",
    modalDetails: {
      problemStatement: "Educational institutes and candidates needed a streamlined recruitment platform to manage job postings, applications, AI resume parsing, candidate matching, and hiring workflows.",
      solution: "Engineered responsive frontend modules and integrated robust backend REST APIs for authentication, candidate profile management, interview scheduling, and recruiter management portals.",
      challenges: "Handling complex multi-role workflows (candidates, recruiters, admins), request/response validation, dynamic data rendering, and seamlessly connecting frontend components to backend services.",
      futureScope: "Expanding automated AI screening models, real-time candidate chat, and advanced analytics dashboards for institutional recruiters."
    }
  },
  {
    name: "Perfect Pizza — Food Ordering App",
    category: "Mobile App",
    liveUrl: "https://play.google.com/store/apps/details?id=com.perfectpizza.fooddelivery",
    thumbnail: "images/projects/mobileapp_mockup.png",
    tech: ["Flutter", "Android SDK", "Firebase", "REST API"],
    features: [
      "Restaurant & Menu Browsing",
      "Interactive Cart & Order Flow",
      "Offers, Coupons & Discounts",
      "Real-Time Order Tracking",
      "Admin & Branch Management"
    ],
    status: "Live",
    projectType: "Client Mobile Application",
    description: "Production food ordering and delivery mobile app for Perfect Pizza with menu browsing and live order tracking.",
    modalDetails: {
      problemStatement: "Perfect Pizza needed a feature-rich, user-friendly mobile application for customers to seamlessly browse menus, apply discounts, place orders, and track deliveries in real time.",
      solution: "Developed a native-feel mobile app featuring full restaurant menu browsing, dynamic cart calculations, coupon processing, real-time order tracking, and branch management workflows.",
      challenges: "Optimizing app load times, handling smooth UI state management during live order tracking, and ensuring reliable order status updates across customer and admin workflows.",
      futureScope: "Integrating loyalty reward point systems and multi-language support for regional expansion."
    }
  },
  {
    name: "Business Website",
    category: "Business",
    liveUrl: "https://gurujitrimbakeshwar.com/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["HTML", "CSS", "JavaScript", "Firebase"],
    features: [
      "Fully Responsive Layout",
      "SEO Friendly Structure",
      "Fast Load Performance",
      "Modern Web UI Design",
      "Contact Form Integration"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "The client needed a trusted, modern, and easily discoverable online platform to present religious service offerings in Trimbakeshwar and capture direct pilgrim bookings.",
      solution: "Developed an elegant, high-contrast, fully responsive business website using vanilla HTML5, CSS3, and JavaScript, backed by Firebase Database for real-time contact forms.",
      challenges: "Structuring the content clearly for mobile users and optimization of SEO parameters to ensure high search visibility on specific religious services queries.",
      futureScope: "Integrating an online service scheduling calendar with automatic WhatsApp notifications and booking confirmation codes."
    }
  },
  {
    name: "ProRoute Logistics",
    category: "Logistics",
    liveUrl: "https://proroute.in/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React", "Firebase", "Tailwind"],
    features: [
      "Responsive Fluid Grid",
      "High Performance Rendering",
      "SEO Optimized Pages",
      "Sleek Modern Design",
      "Interactive Inquiries Forms"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "A logistics transport company required a modern web portal to showcase corporate transportation networks, service listings, and capture cargo requests.",
      solution: "Engineered a React application styled with responsive utility-first Tailwind CSS classes, using Firebase backend API to process contact details securely.",
      challenges: "Implementing complex custom SVG maps illustrating shipping lanes while keeping page loading time exceptionally fast.",
      futureScope: "Adding a client-facing cargo tracking tool and shipping calculator integration."
    }
  },
  {
    name: "Clinic Website",
    category: "Healthcare",
    liveUrl: "https://clinic-website-aarvjs.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React", "Firebase"],
    features: [
      "Responsive Layout",
      "Appointment Scheduler Section",
      "Doctors Profile Cards",
      "Services Portfolio",
      "Integrated Contact Methods"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "A healthcare clinic required a patient-friendly digital portal to exhibit medical services, doctor bios, and request consultation appointments online.",
      solution: "Created a React website with clean typography, simple scheduling workflows, and Firebase backend integration to store and notify staff of new appointments.",
      challenges: "Crafting a clean, highly accessible user experience suitable for elderly patients while ensuring robust form validation.",
      futureScope: "Developing a complete patient panel for viewing consultation history and telehealth virtual consultation spaces."
    }
  },
  {
    name: "A Cube Technology",
    category: "Company",
    liveUrl: "",
    thumbnail: "images/projects/acubetech_mockup.png",
    tech: ["React", "CSS"],
    features: [
      "Premium Theme Design",
      "Responsive Services Grid",
      "Interactive Case Studies",
      "Corporate Visuals",
      "Inbound Leads Capture"
    ],
    status: "Portfolio Project",
    projectType: "Company Website",
    modalDetails: {
      problemStatement: "As the founder of A Cube Technology, I needed an advanced corporate website to showcase our agency software development offerings and attract business leads.",
      solution: "Designed a high-end corporate landing page containing detailed software solutions pages, modern micro-animations, and dynamic feedback layouts.",
      challenges: "Achieving a balance between advanced visual styles (dark futuristic theme) and strict performance load budgets.",
      futureScope: "Adding a dynamic project cost estimation calculator and custom client onboarding portal."
    }
  },
  {
    name: "Coaching Institute",
    category: "Education",
    liveUrl: "https://couching-mu.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React", "Firebase"],
    features: [
      "Courses Catalog Showcase",
      "Admissions Inquiry Handler",
      "Mobile Responsive View",
      "Premium Modern Layout",
      "Direct Call-To-Actions"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "An offline coaching center required a professional digital hub to display subjects taught, admission details, and collect student leads.",
      solution: "Developed an interactive React page showing batch schedules, class details, and a Firebase registration system for incoming query leads.",
      challenges: "Organizing multiple course categories and timing schedules into an easily scannable and clean mobile UI.",
      futureScope: "Integrating student login portals for viewing test scores, downloading syllabus materials, and fee processing."
    }
  },
  {
    name: "USH Online",
    category: "Education",
    liveUrl: "https://ushonline.netlify.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React"],
    features: [
      "Digital Courses Showcase",
      "Responsive Layout Grid",
      "Clean Modern Design",
      "Student Feedbacks Cards",
      "Quick Contacts Options"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "An online educational provider requested a catalog website to host digital courses information and manage prospective student signups.",
      solution: "Built a fast React landing application displaying categorised digital courses, syllabus chapters, and student ratings.",
      challenges: "Optimizing responsive media assets and loading speed to preserve high search engine indexing ranking.",
      futureScope: "Adding online payment gateways to directly purchase courses and video-lesson streaming features."
    }
  },
  {
    name: "Gym Website",
    category: "Fitness",
    liveUrl: "https://gym-aarvjs.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React"],
    features: [
      "Interactive BMI Calculator",
      "Membership Pricing Tiers",
      "Fitness Programs Catalog",
      "Trainer Profile Cards",
      "Dynamic Page Flow"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "A local fitness studio needed a premium dark-themed web platform to illustrate workout structures, display trainer profiles, and list memberships.",
      solution: "Coded a modern React site that includes a custom client BMI calculator, program cards, and CSS transition states.",
      challenges: "Designing high-contrast visual sections in dark/light mode that maintain accessibility standards and fast loading times.",
      futureScope: "Creating a member portal for booking workout slots, purchasing supplements, and scanning entry codes."
    }
  },
  {
    name: "Salon Website",
    category: "Beauty",
    liveUrl: "https://salonaarvjs.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React"],
    features: [
      "Responsive Styling View",
      "Salon Services Price List",
      "Hairstyle Photo Galleries",
      "Booking Request Handler",
      "Direct Business Contact"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "A modern beauty salon needed a digital catalog to showcase styling techniques, highlight pricing guides, and receive appointment inquiries.",
      solution: "Created a visual React landing page featuring photo galleries, service sections, and a responsive appointment inquiry form.",
      challenges: "Optimizing high-resolution portfolio images to load instantly while preventing layout shifts on varying resolutions.",
      futureScope: "Integrating a live seat-booking calendar showing real-time stylist availability."
    }
  },
  {
    name: "School Website",
    category: "Education",
    liveUrl: "https://school-website-aarvjs.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React"],
    features: [
      "Admissions Information Hub",
      "Faculty Directory Grid",
      "Media Events Gallery",
      "Responsive Design Layout",
      "Quick Contacts Options"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "A private primary school requested an information portal to display academic policies, curriculum structures, and notice updates to parents.",
      solution: "Built a robust React website structuring admission rules, staff cards, photo archives, and contact widgets.",
      challenges: "Designing an information architecture that makes school notices and calendar details easy to find for parents.",
      futureScope: "Adding a secure student database login and online report card distribution portal."
    }
  },
  {
    name: "Startup Website",
    category: "Startup",
    liveUrl: "https://website-omega-pink-96.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React", "Firebase"],
    features: [
      "Premium Animated Layout",
      "Glassmorphism UI Elements",
      "Smooth CSS Transitions",
      "SEO Ready Architecture",
      "Fast Assets Loading"
    ],
    status: "Live",
    projectType: "Startup Landing Project",
    modalDetails: {
      problemStatement: "A tech startup wanted a premium-feel, responsive landing page to market their digital product and collect initial user signups.",
      solution: "Engineered a React application styled with modern glassmorphism panels, customized entry animations, and a secure Firebase leads database.",
      challenges: "Integrating heavy visual layouts and custom scroll transitions without introducing frame drops or input lag.",
      futureScope: "Expanding the startup portal to include user authentication and an interactive product dashboard."
    }
  },
  {
    name: "Pandit Ji Dynamic Website",
    category: "Religious Services",
    liveUrl: "https://panditji-portfolio.vercel.app/",
    thumbnail: "images/projects/web.jpeg",
    tech: ["React", "Firebase"],
    features: [
      "Dynamic Content Feed",
      "Ceremony Booking Form",
      "Responsive Modern Layout",
      "Fully Client Managed",
      "Admin Panel Integration"
    ],
    status: "Live",
    projectType: "Client Freelance Project",
    modalDetails: {
      problemStatement: "A spiritual advisor wanted a dynamic portfolio to manage booking requests for rituals and update blog contents regularly.",
      solution: "Engineered a React website backed by Firestore Database, creating a custom admin dashboard for easy real-time service list updates.",
      challenges: "Creating an incredibly simple and security-validated admin dashboard easily operable on mobile screens by non-tech users.",
      futureScope: "Integrating virtual puja options via video streams and a spiritual goods e-store."
    }
  },
  {
    name: "Blockchain Based Supply Chain Tracking System",
    category: "Blockchain",
    liveUrl: "",
    thumbnail: "images/BC.png",
    tech: ["Blockchain", "Smart Contracts", "Web3", "React", "Node.js"],
    features: [
      "Immutable Ledger Records",
      "QR Code Product Tracking",
      "Farmer Authenticity Check",
      "Transparent Operations",
      "Secure Transaction Ledger"
    ],
    status: "Research & Development",
    projectType: "Blockchain Research & Development",
    modalDetails: {
      problemStatement: "Farmers and buyers cannot easily verify product origin, leading to counterfeiting and lack of supply chain transparency.",
      solution: "A blockchain-powered supply chain tracking system records every stage from farm to consumer, ensuring transparency, traceability, and authenticity.",
      challenges: "Creating gas-efficient Solidity contracts to track crop batches while managing wallet connection states securely.",
      futureScope: "Integrating IPFS for decentralized media storage and connecting IoT telemetry sensors for cold-chain monitoring."
    }
  },
  {
    name: "Mobile Application",
    category: "Android",
    liveUrl: "",
    thumbnail: "images/projects/mobileapp_mockup.png",
    tech: ["Flutter", "Dart", "Android SDK", "Firebase"],
    features: [
      "Custom Android UI",
      "Local SQL Caching",
      "Push Notifications System",
      "Offline Synchronization",
      "Battery-Optimized Work"
    ],
    status: "Development",
    projectType: "Mobile Development",
    modalDetails: {
      problemStatement: "Building responsive mobile apps requires managing offline caching states, local database operations, and battery-friendly notifications.",
      solution: "Designed and coded a custom Android app demonstrating the MVVM architectural pattern, SQLite local caching, and custom transitions.",
      challenges: "Ensuring database sync operations run correctly under poor network environments without freezing the UI thread.",
      futureScope: "Compiling a cross-platform iOS build and loading lightweight local machine learning models."
    }
  }
];

function renderProjects() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  projectsData.forEach((project, index) => {
    const card = document.createElement("div");
    card.className = "project-card";
    
    // Check if liveUrl is present to decide visual representation
    let visualHTML = "";
    const isPlayStore = project.liveUrl && project.liveUrl.includes("play.google.com");
    
    if (project.liveUrl && !isPlayStore) {
      visualHTML = `
        <div class="browser-preview">
          <div class="browser-header">
            <div class="browser-dot red"></div>
            <div class="browser-dot yellow"></div>
            <div class="browser-dot green"></div>
            <div class="browser-address">${new URL(project.liveUrl).hostname}</div>
          </div>
          <div class="browser-body">
            <iframe class="browser-iframe" src="${project.liveUrl}" loading="lazy" scrolling="no"></iframe>
            <div class="browser-overlay" aria-hidden="true" tabindex="-1" title="Click to view live site" onclick="window.open('${project.liveUrl}', '_blank')"></div>
          </div>
        </div>
      `;
    } else {
      visualHTML = `
        <img src="${project.thumbnail}" alt="${project.name} Thumbnail" class="project-thumbnail" loading="lazy">
      `;
    }

    const techTagsHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
    const featuresListHTML = project.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join("");

    const liveBtnLabel = isPlayStore ? "Play Store" : "Live Website";
    const liveBtnIcon = isPlayStore ? "fa-brands fa-google-play" : "fa-solid fa-globe";

    const buttonsHTML = `
      ${project.liveUrl ? `
        <a href="${project.liveUrl}" target="_blank" class="project-btn btn-primary" aria-label="Visit ${project.name} ${liveBtnLabel}">
          <i class="${liveBtnIcon}"></i> ${liveBtnLabel}
        </a>
      ` : ""}
      <button class="project-btn btn-secondary btn-read-more" data-index="${index}" aria-label="Read details about ${project.name}">
        <i class="fa-solid fa-book-open"></i> Read More
      </button>
    `;

    const statusClass = project.status.toLowerCase().replace(/[^a-z0-9]/g, "-");

    card.innerHTML = `
      <div class="project-visual">
        ${visualHTML}
      </div>
      <div class="project-info">
        <div class="project-meta">
          <span class="project-category">${project.category}</span>
          <span class="project-status status-${statusClass}">${project.status}</span>
        </div>
        <h3 class="project-name">${project.name}</h3>
        <p class="project-description">${project.description || ""}</p>
        <div class="project-tech">
          ${techTagsHTML}
        </div>
        <ul class="project-features">
          ${featuresListHTML}
        </ul>
        <div class="project-buttons">
          ${buttonsHTML}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Modal handling logic
let modal;
let lastFocusedElement = null;

function openProjectModal(index) {
  const project = projectsData[index];
  if (!project) return;

  // Save the currently focused element
  lastFocusedElement = document.activeElement;

  document.getElementById("modalProjectType").innerText = project.projectType || project.category;
  document.getElementById("modalTitle").innerText = project.name;
  
  // Complete Description
  document.getElementById("modalDescription").innerText = `${project.name} is a professional ${project.category} project engineered to deliver high performance, seamless responsiveness, and exceptional UX.`;
  document.getElementById("modalProblem").innerText = project.modalDetails.problemStatement;
  document.getElementById("modalSolution").innerText = project.modalDetails.solution;
  
  const techContainer = document.getElementById("modalTechnologies");
  techContainer.innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
  
  document.getElementById("modalChallenges").innerText = project.modalDetails.challenges;
  
  const featuresContainer = document.getElementById("modalFeatures");
  featuresContainer.innerHTML = project.features.map(f => `<li>${f}</li>`).join("");
  
  document.getElementById("modalFuture").innerText = project.modalDetails.futureScope;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Lock background scroll

  // Support accessibility focus trapping
  const closeBtn = document.getElementById("modalCloseBtn");
  if (closeBtn) closeBtn.focus();
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // Unlock background scroll

  // Restore focus
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function initProjects() {
  modal = document.getElementById("projectModal");
  renderProjects();

  const container = document.getElementById("projectsContainer");
  if (container) {
    container.addEventListener("click", (e) => {
      const readMoreBtn = e.target.closest(".btn-read-more");
      if (readMoreBtn) {
        const idx = parseInt(readMoreBtn.getAttribute("data-index"), 10);
        openProjectModal(idx);
      }
    });
  }

  const closeBtn = document.getElementById("modalCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeProjectModal);
  }

  const backdrop = modal ? modal.querySelector(".modal-backdrop") : null;
  if (backdrop) {
    backdrop.addEventListener("click", closeProjectModal);
  }
}

// Attach event listeners defensively
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjects);
} else {
  initProjects();
}

// Escape key closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("active")) {
    closeProjectModal();
  }
});

// Handle custom cursor transparency on hover of dynamic elements
document.addEventListener("mouseover", (e) => {
  const customDot = document.querySelector(".custom-dot-cursor");
  if (!customDot) return;

  const targetSelector = 'a, button, [role="button"], .browser-overlay';
  if (e.target.closest(targetSelector)) {
    customDot.classList.add("cursor-hover");
  } else {
    customDot.classList.remove("cursor-hover");
  }
});
