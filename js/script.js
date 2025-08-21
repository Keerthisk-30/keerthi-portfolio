// Theme toggle and persisted preference
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeBtn.setAttribute('aria-pressed', String(isDark));
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
// apply saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeBtn.setAttribute('aria-pressed', 'true');
}

// update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll poly (native CSS used), but ensure focus for accessibility on hash links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.setAttribute('tabindex','-1');
        target.focus();
        history.pushState(null, '', href);
      }
    }
  });
});

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.projects-grid .project');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    projects.forEach(p => {
      p.style.display = (cat === 'all' || p.dataset.category === cat) ? '' : 'none';
    });
  });
});

// GitHub API integration (public rate limits apply). Replace repo names in data-repo attr.
async function fetchRepoStats(repo, elId){
  try{
    const res = await fetch('https://api.github.com/repos/'+repo);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    document.getElementById(elId).textContent = `⭐ Stars: ${data.stargazers_count} | 🍴 Forks: ${data.forks_count}`;
  }catch(e){
    console.warn('GitHub stats not available for', repo, e.message);
  }
}
// map projects to elements
document.querySelectorAll('.project').forEach((p, idx)=>{
  const repo = p.dataset.repo;
  const elId = p.querySelector('.stats') ? p.querySelector('.stats').id : null;
  if(repo && elId){
    // elId is like "repo-web" etc. Use fetch to update each
    fetchRepoStats(repo, elId);
  }
});

// =========================
// Lightbox for Event Photos
// =========================
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.lightbox-img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxOverlay.style.display = 'flex';
  });
});

// Close on click of X or overlay background
lightboxClose.addEventListener('click', () => {
  lightboxOverlay.style.display = 'none';
});

lightboxOverlay.addEventListener('click', e => {
  if(e.target === lightboxOverlay) {
    lightboxOverlay.style.display = 'none';
  }
});