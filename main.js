/**
 * Main Application Logic & Micro-interactions
 * Features:
 * - Dynamic 3D card tilt
 * - Real-time project search & category filter
 * - Progressive loading for 46+ projects
 * - Stats counter animation
 * - Smooth scroll navigation
 */

let activeCategory = 'all';
let currentSearch = '';
let displayLimit = 50; // Show all active projects immediately

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderFilteredProjects();
  initProjectFiltering();
  initProjectSearch();
  initLoadMore();
  initStatsCounter();
});

// 1. Navigation & Scroll Effects
function initNavbar() {
  const navbar = document.querySelector('.navbar-wrapper');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // Active Link Update based on section scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// 2. Filter & Search Logic
function getFilteredProjects() {
  if (typeof portfolioProjects === 'undefined') return [];

  return portfolioProjects.filter(project => {
    // Category match
    const matchesCategory = (activeCategory === 'all') || (project.category === activeCategory);
    
    // Search query match (Title, description, tags, or liveDemoUrl)
    const q = currentSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.tags.some(t => t.toLowerCase().includes(q)) ||
      project.liveDemoUrl.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });
}

// 3. Render Projects into Grid
function renderFilteredProjects() {
  const grid = document.getElementById('projectsGrid');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!grid) return;

  const filtered = getFilteredProjects();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 60px 20px;">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: var(--text-dim); margin-bottom: 16px; display: block;"></i>
        <h3 style="color: var(--text-main); margin-bottom: 8px;">No projects found</h3>
        <p>Try searching for a different keyword or select another category above.</p>
      </div>
    `;
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
    return;
  }

  // Slice based on display limit
  const visibleItems = filtered.slice(0, displayLimit);

  visibleItems.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card glass-panel tilt-card';
    card.dataset.id = project.id;

    const tagsHtml = project.tags
      .map(tag => `<span class="tech-tag">${tag}</span>`)
      .join('');

    // Format display URL cleanly (e.g. allhazardconcepts.com)
    let displayDomain = project.liveDemoUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];

    card.innerHTML = `
      <div class="project-thumbnail">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <div class="project-overlay"></div>
      </div>
      <div class="project-body">
        <span class="project-category-badge">${formatCategoryName(project.category)}</span>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-tags">
          ${tagsHtml}
        </div>
        <div class="project-links">
          <a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-card" title="Open live landing page">
            <span>Visit Live</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          <a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-card" title="${displayDomain}">
            <i class="fa-solid fa-globe"></i>
            <span>${displayDomain}</span>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Handle Load More Button
  if (loadMoreWrap && loadMoreBtn) {
    if (filtered.length > displayLimit) {
      loadMoreWrap.style.display = 'block';
      const remaining = filtered.length - displayLimit;
      loadMoreBtn.innerHTML = `<span>Show More (${remaining} remaining)</span> <i class="fa-solid fa-chevron-down"></i>`;
    } else {
      loadMoreWrap.style.display = 'none';
    }
  }

  // Attach 3D tilt & GSAP reactive pulse
  initCard3DTilt();
  if (typeof initCardGsapReactivity === 'function') {
    initCardGsapReactivity();
  }
}

function formatCategoryName(cat) {
  switch (cat) {
    case 'home-services': return 'Home & Trade Services';
    case 'commercial': return 'Commercial & Industrial';
    case 'consulting': return 'Corporate & Consulting';
    case 'automotive': return 'Automotive & RV';
    default: return cat.toUpperCase();
  }
}

// 4. Project Categories Filter
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-filter') || 'all';
      displayLimit = 12; // Reset limit on category switch
      renderFilteredProjects();
    });
  });
}

// 5. Project Real-time Search
function initProjectSearch() {
  const searchInput = document.getElementById('projectSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    displayLimit = 50; // Show all matching results when searching
    renderFilteredProjects();
  });
}

// 6. Load More Button
function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener('click', () => {
    displayLimit += 15;
    renderFilteredProjects();
  });
}

// 7. Stable & Glitch-Free Card Interaction
function initCard3DTilt() {
  // Pure CSS GPU acceleration is now active on .project-card for 100% stable 60FPS
}

// 8. Animated Number Counters for Stats
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const rawText = stat.innerText;
          const target = parseInt(rawText, 10);
          const suffix = rawText.replace(/[0-9]/g, '');
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            stat.innerText = count + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsBanner = document.querySelector('.hero-stats-banner');
  if (statsBanner) observer.observe(statsBanner);
}
