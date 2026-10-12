/**
 * Searchify - Campus Lost & Found
 * Frontend Application Logic & Backend API Integration
 */

// API Configuration
const API_BASE = window.location.origin.startsWith('http')
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

// Fallback in-memory/localStorage mock dataset if backend is unavailable
const FALLBACK_DEFAULT_ITEMS = [
  {
    id: "item-1",
    title: "Apple AirPods Pro (2nd Gen)",
    type: "lost",
    category: "Electronics",
    location: "Central Library, 2nd Floor Study Area",
    date: "2026-10-11",
    description: "White MagSafe charging case with a small blue silicone carabiner strap. Lost around 4:30 PM.",
    contactName: "Alex Turner",
    contactEmail: "alex.turner@campus.edu",
    contactPhone: "+1 (555) 019-2834",
    status: "active",
    createdAt: "2026-10-11T16:45:00.000Z"
  },
  {
    id: "item-2",
    title: "University Student ID Card",
    type: "found",
    category: "ID & Cards",
    location: "Main Dining Hall, Table 18",
    date: "2026-10-12",
    description: "Student ID card for Emily Chen (ID #CS-2025-4412). Handed over to the front desk.",
    contactName: "Campus Dining Staff",
    contactEmail: "dining-lost@campus.edu",
    contactPhone: "+1 (555) 014-9921",
    status: "active",
    createdAt: "2026-10-12T13:20:00.000Z"
  },
  {
    id: "item-3",
    title: "Midnight Blue Hydro Flask (32oz)",
    type: "lost",
    category: "Clothing & Personal",
    location: "Recreation Center Gym, Court 2",
    date: "2026-10-10",
    description: "Dark blue bottle with NASA and National Parks vinyl stickers on the front. Has a dented bottom rim.",
    contactName: "Marcus Bell",
    contactEmail: "m.bell@campus.edu",
    contactPhone: "+1 (555) 018-7733",
    status: "active",
    createdAt: "2026-10-10T19:10:00.000Z"
  },
  {
    id: "item-4",
    title: "TI-84 Plus CE Graphing Calculator",
    type: "found",
    category: "Electronics",
    location: "Engineering Hall, Room 304",
    date: "2026-10-12",
    description: "Black casing with initials 'J.K.' engraved on the slide-on cover. Battery was at 60%.",
    contactName: "TA Sarah Miller",
    contactEmail: "s.miller@campus.edu",
    contactPhone: "+1 (555) 012-3489",
    status: "active",
    createdAt: "2026-10-12T17:05:00.000Z"
  },
  {
    id: "item-5",
    title: "Black Leather Bifold Wallet",
    type: "lost",
    category: "Wallets & Keys",
    location: "North Campus Bus Terminal",
    date: "2026-10-12",
    description: "Contains metro transit card and library pass. No cash, but sentimental value.",
    contactName: "Jordan Patel",
    contactEmail: "jordan.p@campus.edu",
    contactPhone: "+1 (555) 016-5541",
    status: "active",
    createdAt: "2026-10-12T09:30:00.000Z"
  },
  {
    id: "item-6",
    title: "Set of Dorm Keys with Red Lanyard",
    type: "found",
    category: "Wallets & Keys",
    location: "Science Quad Garden Bench",
    date: "2026-10-09",
    description: "Two brass keys, one electronic fob, attached to a crimson university lanyard.",
    contactName: "Campus Security",
    contactEmail: "security@campus.edu",
    contactPhone: "+1 (555) 011-2000",
    status: "claimed",
    createdAt: "2026-10-09T11:15:00.000Z"
  },
  {
    id: "item-7",
    title: "Spiral Notebook - Organic Chemistry",
    type: "lost",
    category: "Books & Notes",
    location: "Chemistry Building, 1st Floor Lobby",
    date: "2026-10-08",
    description: "Five-star purple spiral notebook with handwritten notes from Chem 201. Urgent need before midterm!",
    contactName: "Sophia Taylor",
    contactEmail: "s.taylor@campus.edu",
    contactPhone: "+1 (555) 017-8890",
    status: "active",
    createdAt: "2026-10-08T15:00:00.000Z"
  },
  {
    id: "item-8",
    title: "Sony WH-1000XM4 Noise Canceling Headphones",
    type: "found",
    category: "Electronics",
    location: "Student Union, Quiet Study Lounge",
    date: "2026-10-07",
    description: "Silver/grey headphones found in zippered travel case left on sofa near the west window.",
    contactName: "David Kim",
    contactEmail: "david.kim@campus.edu",
    contactPhone: "+1 (555) 015-6672",
    status: "claimed",
    createdAt: "2026-10-07T18:40:00.000Z"
  }
];

// App State
const state = {
  items: [],
  filters: {
    type: 'all',       // 'all', 'lost', 'found', 'claimed'
    category: 'all',   // 'all', or specific category
    search: '',        // text query
  },
  user: null,          // logged in user object
  isBackendOnline: false,
  selectedItem: null,
};

// Category Icons Mapping
const CATEGORY_ICONS = {
  'Electronics': '📱',
  'ID & Cards': '🪪',
  'Wallets & Keys': '🔑',
  'Books & Notes': '📚',
  'Clothing & Personal': '🎒',
  'Other': '📦'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initEventListeners();
  testBackendConnection().then(() => {
    loadStats();
    loadItems();
  });
});

// Check if Express backend is running
async function testBackendConnection() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      state.isBackendOnline = true;
      console.log('✓ Connected to Node.js backend API at', API_BASE);
      return;
    }
  } catch (err) {
    console.warn('Backend server not detected or offline. Running with client-side mock store.', err);
    state.isBackendOnline = false;
  }
}

// Fallback Local Storage Helper
function getLocalFallbackItems() {
  try {
    const stored = localStorage.getItem('searchify_mock_items');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  saveLocalFallbackItems(FALLBACK_DEFAULT_ITEMS);
  return FALLBACK_DEFAULT_ITEMS;
}

function saveLocalFallbackItems(items) {
  try {
    localStorage.setItem('searchify_mock_items', JSON.stringify(items));
  } catch (e) {}
}

// ==========================================
// 1. DATA ACCESS LAYER (API with Fallback)
// ==========================================

async function fetchStats() {
  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching stats from API:', err);
    }
  }

  // Fallback calculation
  const items = getLocalFallbackItems();
  const lost = items.filter(i => i.type === 'lost').length;
  const found = items.filter(i => i.type === 'found').length;
  const claimed = items.filter(i => i.status === 'claimed').length;
  const rate = items.length ? Math.round(85 + (claimed / items.length) * 10) : 89;

  return {
    lostItems: 150 + lost,
    foundItems: 90 + found,
    successRate: `${Math.min(99, rate)}%`,
    activeUsers: '500+',
    liveCounts: { total: items.length, lost, found, claimed, active: items.length - claimed }
  };
}

async function fetchItems() {
  if (state.isBackendOnline) {
    try {
      const params = new URLSearchParams();
      if (state.filters.type && state.filters.type !== 'all') {
        if (state.filters.type === 'claimed') {
          params.append('status', 'claimed');
        } else {
          params.append('type', state.filters.type);
        }
      }
      if (state.filters.category && state.filters.category !== 'all') {
        params.append('category', state.filters.category);
      }
      if (state.filters.search) {
        params.append('search', state.filters.search);
      }

      const res = await fetch(`${API_BASE}/items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.items;
      }
    } catch (err) {
      console.error('Error fetching items from API:', err);
    }
  }

  // Fallback filtering
  let items = getLocalFallbackItems();
  if (state.filters.type === 'claimed') {
    items = items.filter(i => i.status === 'claimed');
  } else if (state.filters.type !== 'all') {
    items = items.filter(i => i.type === state.filters.type);
  }

  if (state.filters.category !== 'all') {
    items = items.filter(i => i.category.toLowerCase() === state.filters.category.toLowerCase());
  }

  if (state.filters.search) {
    const q = state.filters.search.toLowerCase().trim();
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return items;
}

async function createItemAPI(itemData) {
  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
      const err = await res.json();
      throw new Error(err.error || 'Failed to report item');
    } catch (err) {
      if (state.isBackendOnline) throw err;
    }
  }

  // Fallback
  const items = getLocalFallbackItems();
  const newItem = {
    id: `item-${Date.now()}`,
    ...itemData,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  items.unshift(newItem);
  saveLocalFallbackItems(items);
  return newItem;
}

async function claimItemAPI(id) {
  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimedBy: state.user ? state.user.name : 'Verified Student' })
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch (err) {
      console.error('Error claiming item via API:', err);
    }
  }

  // Fallback
  const items = getLocalFallbackItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    items[idx].status = 'claimed';
    items[idx].claimedAt = new Date().toISOString();
    saveLocalFallbackItems(items);
    return items[idx];
  }
  return null;
}

// ==========================================
// 2. STATS & NUMBERS ANIMATION
// ==========================================

async function loadStats() {
  const stats = await fetchStats();
  if (!stats) return;

  animateNumber('stat-lost', parseNumber(stats.lostItems));
  animateNumber('stat-found', parseNumber(stats.foundItems));

  const successEl = document.getElementById('stat-success');
  if (successEl) successEl.textContent = stats.successRate;

  const usersEl = document.getElementById('stat-users');
  if (usersEl) usersEl.textContent = stats.activeUsers;
}

function parseNumber(val) {
  if (typeof val === 'number') return val;
  return parseInt(String(val).replace(/\D/g, ''), 10) || 0;
}

function animateNumber(elementId, targetValue) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startValue = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
  const duration = 600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const current = Math.floor(startValue + (targetValue - startValue) * (1 - (1 - progress) * (1 - progress)));
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = targetValue;
    }
  }

  requestAnimationFrame(update);
}

// ==========================================
// 3. ITEMS RENDERING & DISPLAY
// ==========================================

async function loadItems() {
  const container = document.getElementById('items-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading items from portal...</p>
    </div>
  `;

  state.items = await fetchItems();
  renderItems(state.items);
  updateTabCounts();
}

function renderItems(items) {
  const container = document.getElementById('items-grid');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No matching items found</h3>
        <p>Try searching for different keywords or clear your current filters.</p>
        <button type="button" class="clear-filters-btn" onclick="clearFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => createItemCardHTML(item)).join('');
}

function createItemCardHTML(item) {
  const isLost = item.type === 'lost';
  const isClaimed = item.status === 'claimed';
  const icon = CATEGORY_ICONS[item.category] || '📦';

  let statusBadgeClass = isLost ? 'badge-lost' : 'badge-found';
  let statusText = isLost ? 'LOST' : 'FOUND';

  if (isClaimed) {
    statusBadgeClass = 'badge-claimed';
    statusText = 'CLAIMED / RECOVERED';
  }

  // Format date nicely
  const dateFormatted = formatDate(item.date);

  return `
    <div class="item-card ${isClaimed ? 'card-claimed' : ''}" data-id="${escapeHtml(item.id)}">
      <div class="item-card-top">
        <span class="category-pill">${icon} ${escapeHtml(item.category)}</span>
        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
      </div>

      <div class="item-card-body">
        <h3 class="item-card-title">${escapeHtml(item.title)}</h3>
        <p class="item-card-desc">${escapeHtml(item.description || 'No additional details provided.')}</p>

        <div class="item-card-meta">
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span title="${escapeHtml(item.location)}">${escapeHtml(item.location)}</span>
          </div>

          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${escapeHtml(dateFormatted)}</span>
          </div>
        </div>
      </div>

      <div class="item-card-actions">
        <button type="button" class="btn-card-action" onclick="openItemDetails('${escapeHtml(item.id)}')">
          View Details
        </button>
        ${!isClaimed ? `
          <button type="button" class="btn-card-claim" onclick="quickClaimItem('${escapeHtml(item.id)}')">
            ${isLost ? 'Found This!' : 'This is Mine!'}
          </button>
        ` : `
          <span class="claimed-tag">✓ Resolved</span>
        `}
      </div>
    </div>
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

// Update count numbers in filter tabs
async function updateTabCounts() {
  const allItems = state.isBackendOnline ? (await fetchItems()) : getLocalFallbackItems();
  const countAll = allItems.length;
  const countLost = allItems.filter(i => i.type === 'lost' && i.status !== 'claimed').length;
  const countFound = allItems.filter(i => i.type === 'found' && i.status !== 'claimed').length;
  const countClaimed = allItems.filter(i => i.status === 'claimed').length;

  setElText('tab-count-all', `(${countAll})`);
  setElText('tab-count-lost', `(${countLost})`);
  setElText('tab-count-found', `(${countFound})`);
  setElText('tab-count-claimed', `(${countClaimed})`);
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ==========================================
// 4. EVENT LISTENERS & FILTER INTERACTIONS
// ==========================================

function initEventListeners() {
  // Navigation smooth scroll
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-scroll-to');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero Search input
  const heroSearch = document.getElementById('hero-search-input');
  if (heroSearch) {
    heroSearch.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      loadItems();
    });

    heroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const section = document.getElementById('browse-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filters.type = tab.getAttribute('data-type') || 'all';
      loadItems();
    });
  });

  // Category Filter Select
  const categorySelect = document.getElementById('category-filter');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      loadItems();
    });
  }

  // Report Modal Openers
  const btnNavReportLost = document.getElementById('nav-report-lost');
  if (btnNavReportLost) btnNavReportLost.addEventListener('click', () => openReportModal('lost'));

  const btnNavReportFound = document.getElementById('nav-report-found');
  if (btnNavReportFound) btnNavReportFound.addEventListener('click', () => openReportModal('found'));

  const btnHeroReportLost = document.getElementById('hero-report-lost');
  if (btnHeroReportLost) btnHeroReportLost.addEventListener('click', () => openReportModal('lost'));

  const btnHeroReportFound = document.getElementById('hero-report-found');
  if (btnHeroReportFound) btnHeroReportFound.addEventListener('click', () => openReportModal('found'));

  // Report Form Submit
  const reportForm = document.getElementById('report-item-form');
  if (reportForm) {
    reportForm.addEventListener('submit', handleReportFormSubmit);
  }

  // Auth Modal Opener
  const btnSignIn = document.getElementById('signin-btn');
  if (btnSignIn) {
    btnSignIn.addEventListener('click', () => openAuthModal());
  }

  // Auth Form Submit
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function clearFilters() {
  state.filters.type = 'all';
  state.filters.category = 'all';
  state.filters.search = '';

  const heroSearch = document.getElementById('hero-search-input');
  if (heroSearch) heroSearch.value = '';

  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = 'all';

  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-type') === 'all');
  });

  loadItems();
}
window.clearFilters = clearFilters;

// ==========================================
// 5. REPORT MODAL & FORM SUBMISSION
// ==========================================

function openReportModal(defaultType = 'lost') {
  const modal = document.getElementById('report-modal');
  if (!modal) return;

  const form = document.getElementById('report-item-form');
  if (form) form.reset();

  // Set default radio type
  const typeRadio = document.querySelector(`input[name="report-type"][value="${defaultType}"]`);
  if (typeRadio) typeRadio.checked = true;

  // Set default date to today
  const dateInput = document.getElementById('report-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Auto-fill logged in user info if available
  if (state.user) {
    const nameInput = document.getElementById('report-contact-name');
    if (nameInput) nameInput.value = state.user.name;
    const emailInput = document.getElementById('report-contact-email');
    if (emailInput) emailInput.value = state.user.email;
  }

  updateReportModalTitle(defaultType);
  modal.classList.add('modal-open');
}
window.openReportModal = openReportModal;

function updateReportModalTitle(type) {
  const titleEl = document.getElementById('report-modal-title');
  if (titleEl) {
    titleEl.textContent = type === 'lost' ? 'Report a Lost Item' : 'Report a Found Item';
  }
}

async function handleReportFormSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const formData = new FormData(e.target);
  const type = formData.get('report-type') || 'lost';
  const title = (formData.get('title') || '').trim();
  const category = formData.get('category') || 'Other';
  const location = (formData.get('location') || '').trim();
  const date = formData.get('date') || new Date().toISOString().split('T')[0];
  const description = (formData.get('description') || '').trim();
  const contactName = (formData.get('contactName') || '').trim();
  const contactEmail = (formData.get('contactEmail') || '').trim();
  const contactPhone = (formData.get('contactPhone') || '').trim();

  if (!title || !location) {
    showToast('Please provide both the item title and location.', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    return;
  }

  const payload = {
    title,
    type,
    category,
    location,
    date,
    description,
    contactName: contactName || (state.user ? state.user.name : 'Campus Student'),
    contactEmail: contactEmail || (state.user ? state.user.email : ''),
    contactPhone
  };

  try {
    const newItem = await createItemAPI(payload);
    closeAllModals();
    showToast(`Success! Your ${type === 'lost' ? 'lost' : 'found'} item report has been published.`, 'success');

    // Reload items and update stats
    await loadItems();
    await loadStats();

    // Scroll down to the items section to see the new item
    const browseSection = document.getElementById('browse-section');
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    console.error('Error submitting report:', err);
    showToast(err.message || 'Failed to submit report. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

// ==========================================
// 6. ITEM DETAILS & CLAIM FLOW
// ==========================================

function openItemDetails(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  state.selectedItem = item;
  const modal = document.getElementById('detail-modal');
  if (!modal) return;

  const isLost = item.type === 'lost';
  const isClaimed = item.status === 'claimed';
  const icon = CATEGORY_ICONS[item.category] || '📦';

  document.getElementById('detail-category').innerHTML = `${icon} ${escapeHtml(item.category)}`;
  document.getElementById('detail-title').textContent = item.title;
  document.getElementById('detail-desc').textContent = item.description || 'No detailed description provided.';
  document.getElementById('detail-location').textContent = item.location;
  document.getElementById('detail-date').textContent = formatDate(item.date);
  document.getElementById('detail-reporter').textContent = item.contactName || 'Campus Community Member';
  document.getElementById('detail-email').textContent = item.contactEmail || 'Protected / Available upon verification';
  document.getElementById('detail-phone').textContent = item.contactPhone || 'Not provided';

  const statusBadge = document.getElementById('detail-status');
  if (statusBadge) {
    statusBadge.className = `status-badge ${isClaimed ? 'badge-claimed' : (isLost ? 'badge-lost' : 'badge-found')}`;
    statusBadge.textContent = isClaimed ? 'CLAIMED / RECOVERED' : (isLost ? 'LOST ITEM' : 'FOUND ITEM');
  }

  const claimBtn = document.getElementById('detail-claim-btn');
  if (claimBtn) {
    if (isClaimed) {
      claimBtn.style.display = 'none';
    } else {
      claimBtn.style.display = 'inline-block';
      claimBtn.textContent = isLost ? '✓ I Found This Item' : '✓ Claim This Item';
      claimBtn.onclick = () => confirmClaimItem(item.id);
    }
  }

  modal.classList.add('modal-open');
}
window.openItemDetails = openItemDetails;

async function quickClaimItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;
  const promptText = item.type === 'lost' 
    ? `Have you found "${item.title}" and want to mark it as resolved?`
    : `Is "${item.title}" yours and you want to claim it?`;

  if (confirm(promptText)) {
    await confirmClaimItem(id);
  }
}
window.quickClaimItem = quickClaimItem;

async function confirmClaimItem(id) {
  try {
    const updated = await claimItemAPI(id);
    closeAllModals();
    showToast('Success! Item has been marked as resolved & recovered.', 'success');
    await loadItems();
    await loadStats();
  } catch (err) {
    showToast('Failed to claim item. Please try again.', 'error');
  }
}

// ==========================================
// 7. USER AUTHENTICATION & PROFILE
// ==========================================

function initAuth() {
  try {
    const saved = localStorage.getItem('searchify_user');
    if (saved) {
      state.user = JSON.parse(saved);
      renderUserNavbar();
    }
  } catch (e) {}
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('modal-open');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const nameInput = document.getElementById('auth-name');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passInput ? passInput.value.trim() : '';
  const name = nameInput ? nameInput.value.trim() : '';

  if (!email || !password) {
    showToast('Please enter both email and password', 'error');
    return;
  }

  let user = {
    email,
    name: name || email.split('@')[0].replace(/[._]/g, ' '),
    studentId: 'STU-2024-991',
    avatar: '🎓'
  };

  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        user = data.user;
      }
    } catch (err) {
      console.warn('API auth failed, falling back to local session');
    }
  }

  state.user = user;
  try {
    localStorage.setItem('searchify_user', JSON.stringify(user));
  } catch (e) {}

  renderUserNavbar();
  closeAllModals();
  showToast(`Welcome back, ${user.name}!`, 'success');
}

function renderUserNavbar() {
  const container = document.getElementById('auth-container');
  if (!container) return;

  if (state.user) {
    container.innerHTML = `
      <div class="user-chip">
        <span class="user-avatar">${state.user.avatar || '👤'}</span>
        <span class="user-name">${escapeHtml(state.user.name)}</span>
        <button type="button" class="btn-signout" onclick="signOut()">Sign Out</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button type="button" id="signin-btn" class="signin-btn" onclick="openAuthModal()">Sign In</button>
    `;
  }
}

function signOut() {
  state.user = null;
  try {
    localStorage.removeItem('searchify_user');
  } catch (e) {}
  renderUserNavbar();
  showToast('You have been signed out.', 'info');
}
window.signOut = signOut;

function fillDemoUser() {
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const nameInput = document.getElementById('auth-name');
  if (emailInput) emailInput.value = 'alex.patel@campus.edu';
  if (passInput) passInput.value = 'campuspass123';
  if (nameInput) nameInput.value = 'Alex Patel';
}
window.fillDemoUser = fillDemoUser;

// ==========================================
// 8. UTILITIES & MODAL HELPERS
// ==========================================

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('modal-open'));
}
window.closeAllModals = closeAllModals;

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
