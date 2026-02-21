/**
 * EduStream LMS - Student Learning Management System
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initQuizModal();
  initResourceFilters();
  initSearch();
  initSmoothScroll();
  initLinkModals();
});

// Navigation - switch sections and update active state
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[href^="#"]');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').slice(1);
      
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      sections.forEach(section => {
        section.classList.toggle('active', section.id === targetId);
      });
      
      // Re-initialize Lucide icons for newly visible content
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });
}

// Quiz Modal - open/close and basic quiz flow
function initQuizModal() {
  const modal = document.getElementById('quiz-modal');
  const startButtons = document.querySelectorAll('.quiz-card.pending .btn-primary');
  const closeBtn = modal?.querySelector('.modal-close');
  const prevBtn = document.getElementById('prev-q');
  const nextBtn = document.getElementById('next-q');

  startButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    const progressFill = document.getElementById('quiz-progress');
    const submitBtn = document.getElementById('next-q');
    if (progressFill) progressFill.style.width = '33%';
    if (submitBtn) submitBtn.textContent = 'Next';
  }

  closeBtn?.addEventListener('click', closeModal);
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
  });

  prevBtn?.addEventListener('click', () => {
    const progressFill = document.getElementById('quiz-progress');
    const width = progressFill?.style.width || '33%';
    const num = Math.max(0, parseInt(width) - 33);
    if (progressFill) progressFill.style.width = `${num}%`;
  });

  nextBtn?.addEventListener('click', () => {
    const progressFill = document.getElementById('quiz-progress');
    const width = progressFill?.style.width || '33%';
    const num = Math.min(100, parseInt(width) + 33);
    if (progressFill) progressFill.style.width = `${num}%`;
    if (num >= 100) {
      nextBtn.textContent = 'Submit';
      nextBtn.addEventListener('click', () => {
        closeModal();
        nextBtn.textContent = 'Next';
      }, { once: true });
    }
  });
}

// Resource filter buttons
function initResourceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const resourceCards = document.querySelectorAll('.resource-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.textContent.trim();
      
      resourceCards.forEach(card => {
        const tag = card.querySelector('.resource-tag')?.textContent.trim();
        const show = filter === 'All' || tag === filter;
        card.style.display = show ? 'block' : 'none';
        card.style.animation = 'fadeIn 0.3s ease';
      });
    });
  });
}

// Search - filter courses and resources by search term
function initSearch() {
  const searchInput = document.querySelector('.search-box input');
  
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    document.querySelectorAll('.course-card, .resource-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      const show = !query || text.includes(query);
      card.style.display = show ? '' : 'none';
    });
  });
}

// Content for various links
const LINK_CONTENT = {
  library: {
    title: 'University Library',
    icon: 'globe',
    description: 'Access e-books, academic journals, and research databases.',
    links: [
      { text: 'E-Books Collection', url: 'https://www.gutenberg.org/' },
      { text: 'Google Scholar', url: 'https://scholar.google.com/' },
      { text: 'Open Library', url: 'https://openlibrary.org/' },
    ]
  },
  'useful-links': {
    title: 'Useful Links',
    icon: 'link',
    description: 'Academic and professional learning platforms for university students.',
    links: [
      { text: 'Khan Academy', url: 'https://www.khanacademy.org/' },
      { text: 'Coursera', url: 'https://www.coursera.org/' },
      { text: 'edX', url: 'https://www.edx.org/' },
      { text: 'Duolingo', url: 'https://www.duolingo.com/' },
      { text: 'YouTube Education', url: 'https://www.youtube.com/education' },
    ]
  },
  audio: {
    title: 'Audio Resources',
    icon: 'headphones',
    description: 'Podcasts and study music to enhance your learning experience.',
    links: [
      { text: 'Spotify Study Playlists', url: 'https://open.spotify.com/genre/study' },
      { text: 'TED Talks', url: 'https://www.ted.com/talks' },
      { text: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish/' },
    ]
  },
  'study-groups': {
    title: 'Study Groups',
    icon: 'users',
    description: 'Connect with peers and form study groups.',
    content: '<p>Join or create a study group:</p><ul><li><strong>Calculus I</strong> — Tuesdays 4pm, Library 203</li><li><strong>Data Structures</strong> — Wednesdays 3pm, Lab A</li><li><strong>Discrete Math</strong> — Thursdays 5pm, Room 105</li></ul><p>Contact Student Services or your lecturer to join.</p>',
  },
  tutor: {
    title: 'Academic Support',
    icon: 'help-circle',
    description: 'Book 1-on-1 sessions with academic tutors.',
    content: '<p>Available for: Calculus, Data Structures, Programming, Discrete Math</p><p><strong>Office Hours:</strong> Mon–Fri, 2pm–6pm</p><p>Email: <a href="mailto:academicsupport@university.edu">academicsupport@university.edu</a> to book.</p>',
  },
  calendar: {
    title: 'Academic Calendar',
    icon: 'calendar-check',
    content: '<ul class="calendar-list"><li><strong>Mar 15–19</strong> — Midterm examinations</li><li><strong>Mar 28</strong> — Easter recess</li><li><strong>Apr 7</strong> — Teaching resumes</li><li><strong>May 20–31</strong> — Final examinations</li><li><strong>Jun 15</strong> — Semester ends · Results published</li></ul>',
  }
};

const RESOURCE_CONTENT = {
  'calculus-notes': { title: 'Calculus I — Lecture Notes', desc: 'Complete notes on limits, derivatives, and integration.', link: 'Download PDF', linkText: 'calculus-lecture-notes.pdf' },
  'ds-videos': { title: 'Data Structures Videos', desc: 'Video lectures on linked lists, trees, graphs, and algorithms.', link: 'Watch Videos', linkText: 'data-structures' },
  'discrete-slides': { title: 'Discrete Math — Proofs', desc: 'Notes on induction, logic, set theory, and combinatorics.', link: 'View Slides', linkText: 'discrete-math-proofs.pdf' },
  'research-guide': { title: 'Research Paper Guide', desc: 'Academic writing: structure, thesis, and APA citations.', link: 'Open Guide', linkText: 'research-writing.pdf' },
  'python-pdf': { title: 'Python & OOP Notes', desc: 'Programming fundamentals: classes, inheritance, design patterns.', link: 'Download PDF', linkText: 'python-oop.pdf' },
  'algorithms-pdf': { title: 'Algorithm Analysis', desc: 'Big-O notation, sorting algorithms, and searching techniques.', link: 'Download PDF', linkText: 'algorithm-analysis.pdf' },
};

const COURSE_CONTENT = {
  math: { title: 'Calculus I', modules: ['Limits & Continuity', 'Derivatives', 'Applications of Derivatives', 'Integration', 'Applications of Integration'] },
  science: { title: 'Data Structures', modules: ['Arrays & Linked Lists', 'Stacks & Queues', 'Trees & BST', 'Graphs', 'Sorting & Searching'] },
  english: { title: 'Academic Writing', modules: ['Research Methods', 'Thesis Development', 'Citation & Referencing', 'Technical Writing'] },
  history: { title: 'Discrete Mathematics', modules: ['Logic & Propositional Calculus', 'Set Theory', 'Proof Techniques', 'Combinatorics', 'Graph Theory'] },
  comp: { title: 'Programming Fundamentals', modules: ['Python Basics', 'Control Structures', 'Functions & Modules', 'OOP in Python', 'Testing & Debugging'] },
  pe: { title: 'Ethics & Society', modules: ['Tech Ethics', 'Privacy & Data', 'AI & Responsibility', 'Professional Ethics'] },
};

function closeContentModal(modal) {
  modal?.classList.remove('active');
  document.body.style.overflow = '';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showContentModal(html) {
  const modal = document.getElementById('content-modal');
  const body = document.getElementById('content-modal-body');
  if (body) body.innerHTML = html;
  modal?.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Link / Resource / Course modals
function initLinkModals() {
  const contentModal = document.getElementById('content-modal');
  const closeBtn = contentModal?.querySelector('[data-close="content-modal"]');
  closeBtn?.addEventListener('click', () => closeContentModal(contentModal));
  contentModal?.addEventListener('click', (e) => { if (e.target === contentModal) closeContentModal(contentModal); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && contentModal?.classList.contains('active')) closeContentModal(contentModal); });

  // Material / Other Resources links
  document.querySelectorAll('.link-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-link');
      const data = LINK_CONTENT[key];
      if (!data) return;
      let html = `<h2><i data-lucide="${data.icon}"></i> ${data.title}</h2>`;
      if (data.description) html += `<p class="content-desc">${data.description}</p>`;
      if (data.links) {
        html += '<div class="link-list">';
        data.links.forEach(l => { html += `<a href="${l.url}" target="_blank" rel="noopener" class="external-link"><i data-lucide="external-link"></i> ${l.text}</a>`; });
        html += '</div>';
      }
      if (data.content) html += `<div class="content-html">${data.content}</div>`;
      showContentModal(html);
    });
  });

  // Resource cards (Learning Resources)
  document.querySelectorAll('.resource-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-resource');
      const data = RESOURCE_CONTENT[key];
      if (!data) return;
      const html = `
        <h2>${data.title}</h2>
        <p class="content-desc">${data.desc}</p>
        <a href="#" class="btn btn-primary" onclick="event.preventDefault(); alert('Opening ${data.linkText}...');">
          <i data-lucide="download"></i> ${data.link}
        </a>
      `;
      showContentModal(html);
    });
  });

  // Course Continue/Review links
  document.querySelectorAll('.course-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-course');
      const data = COURSE_CONTENT[key];
      if (!data) return;
      let html = `<h2>${data.title} — Course Content</h2><p class="content-desc">Your modules for this semester:</p><ul class="course-modules">`;
      data.modules.forEach(m => { html += `<li><i data-lucide="book-open"></i> ${m}</li>`; });
      html += '</ul><a href="#" class="btn btn-primary" onclick="event.preventDefault(); alert(\'Opening course materials...\');"><i data-lucide="play"></i> Start Lesson</a>';
      showContentModal(html);
    });
  });
}

// Smooth scroll for hash links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
