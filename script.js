/* ===== Portfolio script (v5) ===== */
(() => {
  // ---------- helpers ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- theme toggle + year ----------
  const rootEl   = document.documentElement;
  const toggleBtn = $('#themeToggle');
  const stored    = localStorage.getItem('theme');
  const initial   = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  rootEl.classList.toggle('dark', initial === 'dark');

  toggleBtn && toggleBtn.addEventListener('click', () => {
    const isDark = rootEl.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = isDark ? '☾' : '☀';
  });

  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------- projects ----------
  const grid      = $('#projectGrid');
  const search    = $('#search');
  const tagFilter = $('#tagFilter');
  const warn      = $('#projWarn');
  if (!grid) return;

  let PROJECTS = [];

  // Skeleton placeholders while loading
  const renderSkeleton = (n = 6) => {
    grid.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const s = document.createElement('article');
      s.className = 'card p-5';
      s.innerHTML = `
        <div class="skel h-44 mb-4"></div>
        <div class="skel h-6 w-2/3 mb-2"></div>
        <div class="skel h-4 w-11/12 mb-2"></div>
        <div class="skel h-4 w-9/12"></div>
      `;
      grid.appendChild(s);
    }
  };

  const tagPill = (text) => {
    const s = document.createElement('span');
    s.className = 'tag';
    s.textContent = text;
    return s;
  };

  // ---------- Modal refs & logic ----------
  const modal        = $('#projModal');
  const dlg          = $('#projModalDialog');
  const closeBtn     = $('#projModalClose');
  const mTitle       = $('#projModalTitle');
  const mImg         = $('#projModalImg');
  const mDesc        = $('#projModalDesc');
  const mList        = $('#projModalList');
  const mTags        = $('#projModalTags');
  const mLinks       = $('#projModalLinks');

  let lastFocused = null;

  function fillModal(p) {
    const title = p.title || 'Project';
    const desc  = p.description || '';
    const list  = Array.isArray(p.highlights) ? p.highlights : [];
    const tags  = p.tech || [];

    mTitle.textContent = title;
    mDesc.textContent  = desc;

    // Image with fallback
    mImg.src = p.image || '';
    mImg.alt = `${title} preview`;
    mImg.loading = 'eager';
    mImg.decoding = 'async';
    mImg.onerror = () => {
      mImg.style.background = 'linear-gradient(180deg, rgba(14,165,233,.15), rgba(2,6,23,.85))';
      mImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
           <rect width="800" height="420" rx="24" fill="#0B1220"/>
           <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
                 fill="#9CA3AF" font-family="Inter,Arial" font-size="20">${title}</text>
         </svg>`
      );
    };

    // Highlights
    mList.innerHTML = list.map(h => `<li>${h}</li>`).join('');

    // Tags
    mTags.innerHTML = '';
    tags.forEach(t => mTags.appendChild(tagPill(t)));

    // Links
    mLinks.innerHTML = '';
    if (p.github) {
      const a = document.createElement('a');
      a.className = 'btn-ghost';
      a.target = '_blank'; a.rel = 'noreferrer'; a.href = p.github;
      a.innerHTML = `
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.33-1.77-1.33-1.77-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.82 1.3 3.5.99.11-.78.42-1.3.77-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.58A12 12 0 0 0 12 .5z"/>
        </svg>
        GitHub
      `;
      mLinks.appendChild(a);
    }
    if (p.demo) {
      const b = document.createElement('a');
      b.className = 'btn';
      b.target = '_blank'; b.rel = 'noreferrer'; b.href = p.demo;
      b.textContent = 'Live Demo';
      mLinks.appendChild(b);
    }
  }

  function getFocusableInModal() {
    return $$('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])', dlg)
      .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
  }

  function openModal(project) {
    if (!modal) return;
    fillModal(project);

    lastFocused = document.activeElement;

    modal.classList.add('open');
    modal.classList.add('modal-enter');
    requestAnimationFrame(() => modal.classList.add('modal-enter-active'));
    setTimeout(() => modal.classList.remove('modal-enter', 'modal-enter-active'), 190);

    document.body.classList.add('overflow-hidden');
    closeBtn?.focus();
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
    modal.setAttribute('aria-hidden', 'true');
    lastFocused && lastFocused.focus();
  }

  // Close handlers
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click on backdrop
  });
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      const f = getFocusableInModal();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------- Card + render ----------
  const projectCard = (p, idx) => {
    const card = document.createElement('article');
    card.className = 'card project-card p-5 flex flex-col hover:-translate-y-[1px] transition';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open details for ${p.title || 'project'}`);

    const safeTitle = p.title || 'Project';
    const safeDesc  = p.description || '';
    const safeImg   = p.image || '';
    const highlights = Array.isArray(p.highlights) ? p.highlights : [];

    card.innerHTML = `
      <div class="relative">
        <img
          src="${safeImg}"
          alt="${safeTitle} thumbnail"
          class="project-thumb w-full aspect-video object-cover"
          loading="lazy" decoding="async"
        />
        <span class="thumb-overlay"></span>
      </div>

      <h3 class="mt-4 text-lg md:text-xl font-semibold">${safeTitle}</h3>

      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        ${safeDesc}
      </p>

      <ul class="mt-3 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
        ${highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>

      <div class="mt-3 flex flex-wrap gap-2" data-tags></div>

      <div class="mt-4 flex items-center gap-3">
        ${p.github ? `
          <a class="btn-ghost" target="_blank" rel="noreferrer" href="${p.github}" aria-label="GitHub link">GitHub</a>` : ''}
        ${p.demo ? `<a class="btn" target="_blank" rel="noreferrer" href="${p.demo}" aria-label="Live demo">Live Demo</a>` : ''}
      </div>
    `;

    // Tags
    const row = card.querySelector('[data-tags]');
    (p.tech || []).forEach(t => row.appendChild(tagPill(t)));

    // Fallback preview if image fails
    const img = card.querySelector('img');
    img && (img.onerror = () => {
      img.style.background = 'linear-gradient(180deg, rgba(14,165,233,.15), rgba(2,6,23,.85))';
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
           <rect width="800" height="420" rx="24" fill="#0B1220"/>
           <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
                 fill="#9CA3AF" font-family="Inter,Arial" font-size="20">${safeTitle}</text>
         </svg>`
      );
    });

    // Open modal on card click/Enter (but not when clicking links/buttons)
    card.addEventListener('click', (e) => {
      if (e.target.closest('a,button')) return;
      openModal(PROJECTS[idx]);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(PROJECTS[idx]);
      }
    });

    return card;
  };

  const render = () => {
    const q  = (search?.value || '').toLowerCase();
    const tg = tagFilter?.value || '';
    grid.innerHTML = '';

    // persist state to URL
    const sp = new URLSearchParams(location.search);
    q ? sp.set('q', q) : sp.delete('q');
    tg ? sp.set('tag', tg) : sp.delete('tag');
    history.replaceState(null, '', `${location.pathname}?${sp.toString()}`);

    const list = PROJECTS
      .map((p, idx) => ({ p, idx }))
      .filter(({ p }) => {
        const hay = [p.title, p.description, ...(p.tech || [])].join(' ').toLowerCase();
        return hay.includes(q) && (tg ? (p.tech || []).includes(tg) : true);
      });

    if (!list.length) {
      const d = document.createElement('div');
      d.className = 'text-gray-500';
      d.textContent = 'No matching projects.';
      grid.appendChild(d);
    } else {
      list.forEach(({ p, idx }) => grid.appendChild(projectCard(p, idx)));
    }
  };

  const loadProjects = async () => {
    // Show skeletons first
    renderSkeleton();

    try {
      const res = await fetch('projects.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      PROJECTS = await res.json();
    } catch {
      // inline fallback
      const inline = document.getElementById('projects-embedded');
      if (inline && inline.textContent.trim()) {
        try { PROJECTS = JSON.parse(inline.textContent); } catch {}
      }
      if (!PROJECTS.length && warn) warn.classList.remove('hidden');
    }

    // restore state from URL (if present)
    const params = new URLSearchParams(location.search);
    if (search && params.get('q'))  search.value     = params.get('q');
    if (tagFilter && params.get('tag')) tagFilter.value = params.get('tag');

    // build tags
    const tags = new Set(PROJECTS.flatMap(p => p.tech || []));
    if (tagFilter) {
      // avoid duplicates if user navigates without reload
      const existing = new Set($$('#tagFilter option').map(o => o.value));
      tags.forEach(t => {
        if (existing.has(t)) return;
        const o = document.createElement('option');
        o.value = t; o.textContent = t;
        tagFilter.appendChild(o);
      });
    }

    render();
  };

  search && search.addEventListener('input', render);
  tagFilter && tagFilter.addEventListener('change', render);

  loadProjects();
})();
