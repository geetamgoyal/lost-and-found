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
    location: "Central Library - Reading Hall (Administrative Block)",
    date: "2026-10-11",
    description: "White MagSafe charging case with a small blue silicone carabiner strap. Lost around 4:30 PM.",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
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
    location: "CS / IT Block Canteen",
    date: "2026-10-12",
    description: "Student ID card for Emily Chen (ID #CS-2025-4412). Handed over to the front desk.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
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
    location: "Campus Gymnasium",
    date: "2026-10-10",
    description: "Dark blue bottle with NASA and National Parks vinyl stickers on the front. Has a dented bottom rim.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
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
    location: "Lecture Theatre Complex (LT)",
    date: "2026-10-12",
    description: "Black casing with initials 'J.K.' engraved on the slide-on cover. Battery was at 60%.",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80",
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
    location: "Mechanical Block Canteen",
    date: "2026-10-12",
    description: "Contains metro transit card and library pass. No cash, but sentimental value.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
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
    location: "Senior Boys Hostel Complex",
    date: "2026-10-09",
    description: "Two brass keys, one electronic fob, attached to a crimson university lanyard.",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    contactName: "Campus Security",
    contactEmail: "security@campus.edu",
    contactPhone: "+1 (555) 011-2000",
    status: "claimed",
    createdAt: "2026-10-09T11:15:00.000Z"
  },
  {
    id: "item-7",
    title: "Spiral Notebook - Engineering Chemistry",
    type: "lost",
    category: "Books & Notes",
    location: "Applied Sciences - Chemistry Lab",
    date: "2026-10-08",
    description: "Five-star purple spiral notebook with handwritten notes from Chem 201. Urgent need before midterm!",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
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
    location: "Computer Center",
    date: "2026-10-07",
    description: "Silver/grey headphones found in zippered travel case left on table near the west window.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
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
    location: 'all',   // 'all', or specific campus location
    search: '',        // text query
  },
  user: null,          // logged in user object
  isBackendOnline: false,
  selectedItem: null,
  activeLocationCategory: 'all',
  locationSearchQuery: ''
};

/**
 * =========================================================================
 * CAMPUS LOCATIONS DIRECTORY - AKGEC GHAZIABAD
 * Official Infrastructure Master List (Ajay Kumar Garg Engineering College)
 * =========================================================================
 */
const CAMPUS_LOCATIONS = [
  {
    id: "academic",
    name: "1. Academic Buildings",
    icon: "🏛️",
    description: "Administrative Block, CS/IT, EN/EC, Mechanical, MCA blocks & LT complex",
    subcategories: [
      "Administrative Block",
      "Main Block / Back Block",
      "Lecture Theatre Complex (LT)",
      "CS / IT Block",
      "EN / EC Block",
      "Mechanical Engineering Block",
      "MCA Block",
      "Computer Center",
      "Lecture Rooms and Tutorial Rooms",
      "Seminar Halls"
    ]
  },
  {
    id: "library",
    name: "2. Library and Study Areas",
    icon: "📚",
    description: "Central Library in Administrative Block, Reading Hall, Cubicles & Digital Library",
    subcategories: [
      "Central Library (Administrative Block)",
      "Central Library - Reading Hall",
      "Central Library - Study Cubicles",
      "Central Library - Digital Library",
      "Central Library - Faculty Reading Room",
      "Departmental Libraries",
      "Hostel Libraries"
    ]
  },
  {
    id: "labs",
    name: "3. Department and Laboratory Areas",
    icon: "🔬",
    description: "CSE, IT, ECE, EN, Mechanical workshop, Civil & Applied Sciences labs",
    subcategories: [
      "Computer Science and Engineering Labs",
      "Information Technology Labs",
      "Electronics and Communication Engineering Labs",
      "Electrical and Electronics Engineering Labs",
      "Mechanical Engineering Workshop & Labs",
      "Civil Engineering Labs",
      "Applied Sciences - Chemistry Lab",
      "Applied Sciences - Physics Lab",
      "Language Lab (AS&H)",
      "MCA Department Labs",
      "Department Faculty Rooms & Cabins"
    ]
  },
  {
    id: "dining",
    name: "4. Food and Refreshments",
    icon: "☕",
    description: "Mechanical Block canteen, CS/IT canteen, hostel messes, tuck shops & coffee points",
    subcategories: [
      "Mechanical Block Canteen",
      "CS / IT Block Canteen",
      "Junior Boys Hostel Mess",
      "Senior Boys Hostel Mess",
      "Girls Hostel Mess",
      "Hostel Canteens",
      "Hostel Provision Stores",
      "Coffee & Tea Vending Points"
    ]
  },
  {
    id: "hostels",
    name: "5. Hostels and Residential Areas",
    icon: "🏢",
    description: "Junior/Senior Boys, Girls hostel complexes, dining halls, gym & libraries",
    subcategories: [
      "Junior Boys Hostel Complex",
      "Senior Boys Hostel Complex",
      "Girls Hostel Complex",
      "Junior Girls Hostel Complex",
      "Hostel Mess and Dining Areas",
      "Hostel Gymnasiums",
      "Hostel Libraries",
      "Hostel TV / Recreation Rooms",
      "Hostel Utility Shops"
    ]
  },
  {
    id: "sports",
    name: "6. Sports and Recreation",
    icon: "⚽",
    description: "Football ground, basketball, badminton courts, gym, faith centre & amphitheatre",
    subcategories: [
      "Football Ground",
      "Basketball Court",
      "Badminton Courts",
      "Volleyball Court",
      "Table Tennis Area",
      "Pool Table Area",
      "Gymnasium",
      "Faith Centre",
      "Amphitheatre"
    ]
  },
  {
    id: "services",
    name: "7. Essential Services",
    icon: "🏥",
    description: "Indo-German Hospital, ATM, stationery, reprographic shops & transport area",
    subcategories: [
      "Indo German Hospital / On-campus Medical Facility",
      "First Aid Facility",
      "Administrative Offices",
      "ATM",
      "Stationery Shop",
      "Reprographic / Photocopy Shops",
      "Campus Transport Area",
      "Main Entrance / Security Gate",
      "Parking Areas"
    ]
  },
  {
    id: "outdoor",
    name: "8. Outdoor and Common Areas",
    icon: "🌳",
    description: "Main entrance, campus lawns, landscaped gardens, internal walkways & parking",
    subcategories: [
      "Main Entrance and Exit",
      "Campus Lawns",
      "Gardens and Landscaped Areas",
      "Internal Walkways",
      "Amphitheatre / Open Gathering Area",
      "Event and Exhibition Areas",
      "Bus Pickup / Drop-off Area",
      "Bicycle or Two-wheeler Parking"
    ]
  },
  {
    id: "other",
    name: "9. Other Campus Locations",
    icon: "📍",
    description: "Custom or unlisted AKGEC location",
    subcategories: [
      "Custom / Unlisted Spot (Specify Below)"
    ]
  }
];

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
  initCampusLocations();
  testBackendConnection().then(() => {
    loadStats();
    loadItems();
  });
});

// Check if Express backend is running
async function testBackendConnection() {
  state.isBackendOnline = false;

  console.log(
    "Searchify Demo Mode: Using localStorage"
  );

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
    if (stored) {
      const items = JSON.parse(stored);
      if (Array.isArray(items) && items.length > 0) {
        // Upgrade legacy cached items with default sample images if missing
        let hasUpgrade = false;
        const upgraded = items.map(item => {
          if (!item.image) {
            const match = FALLBACK_DEFAULT_ITEMS.find(f => f.id === item.id || f.title === item.title);
            if (match && match.image) {
              hasUpgrade = true;
              return { ...item, image: match.image };
            }
          }
          return item;
        });
        if (hasUpgrade) saveLocalFallbackItems(upgraded);
        return upgraded;
      }
    }
  } catch (e) { }
  saveLocalFallbackItems(FALLBACK_DEFAULT_ITEMS);
  return FALLBACK_DEFAULT_ITEMS;
}

function saveLocalFallbackItems(items) {
  try {
    localStorage.setItem('searchify_mock_items', JSON.stringify(items));
  } catch (e) { }
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
      if (state.filters.location && state.filters.location !== 'all') {
        params.append('location', state.filters.location);
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

  if (state.filters.location && state.filters.location !== 'all') {
    const locLower = state.filters.location.toLowerCase();
    items = items.filter(i => (i.location || '').toLowerCase().includes(locLower));
  }

  if (state.filters.search) {
    const q = state.filters.search.toLowerCase().trim();
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.location || '').toLowerCase().includes(q) ||
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

async function deleteItemAPI(id) {
  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Error deleting item via API:', err);
    }
  }

  // Fallback
  let items = getLocalFallbackItems();
  items = items.filter(i => i.id !== id);
  saveLocalFallbackItems(items);
  return true;
}

// Option B: Determine relationship between logged in user and item
function getUserItemRelationship(item) {
  if (!state.user) {
    return {
      isAuthenticated: false,
      isOwner: false,
      isAdmin: false
    };
  }

  const userEmail = (state.user.email || '').toLowerCase().trim();
  const itemEmail = (item.contactEmail || '').toLowerCase().trim();
  const userName = (state.user.name || '').toLowerCase().trim();
  const itemReporter = (item.contactName || '').toLowerCase().trim();

  const isAdmin = userEmail.includes('admin') || state.user.isAdmin === true;
  const isOwner = (userEmail && itemEmail && userEmail === itemEmail) ||
                  (userName && itemReporter && userName === itemReporter) ||
                  isAdmin;

  return {
    isAuthenticated: true,
    isOwner,
    isAdmin
  };
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
  const rel = getUserItemRelationship(item);

  let statusBadgeClass = isLost ? 'badge-lost' : 'badge-found';
  let statusText = isLost ? 'LOST' : 'FOUND';

  if (isClaimed) {
    statusBadgeClass = 'badge-claimed';
    statusText = 'CLAIMED / RECOVERED';
  }

  // Format date nicely
  const dateFormatted = formatDate(item.date);

  // Card Image or Themed Visual Header
  const imageMarkup = item.image
    ? `
      <div class="item-card-image-box">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="item-card-image" loading="lazy" onerror="this.onerror=null; this.closest('.item-card-image-box').classList.add('img-fallback-active');">
        <span class="card-image-badge ${isLost ? 'badge-lost' : 'badge-found'}">${isLost ? 'LOST' : 'FOUND'}</span>
        ${rel.isOwner ? `<span class="card-owner-badge">👤 Your Post</span>` : ''}
      </div>
    `
    : `
      <div class="item-card-image-box item-card-placeholder-box">
        <span class="item-card-placeholder-icon">${icon}</span>
        <span class="card-image-badge ${isLost ? 'badge-lost' : 'badge-found'}">${isLost ? 'LOST' : 'FOUND'}</span>
        ${rel.isOwner ? `<span class="card-owner-badge">👤 Your Post</span>` : ''}
      </div>
    `;

  // Option B: Dynamic actions based on Auth and Relationship
  let actionButtonsHtml = '';

  if (isClaimed) {
    actionButtonsHtml = `
      <button type="button" class="btn-card-action" onclick="openItemDetails('${escapeHtml(item.id)}')">
        View Details
      </button>
      <span class="claimed-tag">✓ Resolved</span>
    `;
  } else if (!rel.isAuthenticated) {
    // 1) Guest / Signed Out
    actionButtonsHtml = `
      <button type="button" class="btn-card-action" onclick="openItemDetails('${escapeHtml(item.id)}')">
        View Details
      </button>
      <button type="button" class="btn-card-auth-hint" onclick="openAuthModal()" title="Sign in to claim or resolve">
        Sign in to Claim
      </button>
    `;
  } else if (rel.isOwner) {
    // 2) Original Reporter (Owner of the post)
    actionButtonsHtml = `
      <button type="button" class="btn-card-action" onclick="openItemDetails('${escapeHtml(item.id)}')">
        View Details
      </button>
      <button type="button" class="btn-card-resolve" onclick="ownerResolveItem('${escapeHtml(item.id)}')">
        ✓ Resolve
      </button>
    `;
  } else {
    // 3) Another signed-in student
    actionButtonsHtml = `
      <button type="button" class="btn-card-action" onclick="openItemDetails('${escapeHtml(item.id)}')">
        View Details
      </button>
      <button type="button" class="btn-card-claim" onclick="studentClaimItem('${escapeHtml(item.id)}')">
        ${isLost ? 'Found This!' : 'Claim Item'}
      </button>
    `;
  }

  return `
    <div class="item-card ${isClaimed ? 'card-claimed' : ''} ${rel.isOwner ? 'card-own-post' : ''}" data-id="${escapeHtml(item.id)}">
      ${imageMarkup}

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
        ${actionButtonsHtml}
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

  // Initialize image upload dropzone, file input, and URL listeners
  initImageUpload();

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
  state.filters.location = 'all';
  state.filters.search = '';

  const heroSearch = document.getElementById('hero-search-input');
  if (heroSearch) heroSearch.value = '';

  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = 'all';

  const locSelect = document.getElementById('location-filter');
  if (locSelect) locSelect.value = 'all';

  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-type') === 'all');
  });

  loadItems();
}
window.clearFilters = clearFilters;

// ==========================================
// 4B. CAMPUS LOCATIONS DIRECTORY LOGIC
// ==========================================

function initCampusLocations() {
  renderLocationTabs();
  renderPlacesGrid();
  initLocationSearch();
  populateLocationFilterDropdown();
  initReportModalLocationSelectors();
}

function renderLocationTabs() {
  const tabsContainer = document.getElementById('location-category-tabs');
  if (!tabsContainer) return;

  const totalPlaces = CAMPUS_LOCATIONS.reduce((sum, cat) => sum + cat.subcategories.length, 0);

  let html = `
    <button type="button" class="location-category-tab ${state.activeLocationCategory === 'all' ? 'active' : ''}" data-cat-id="all">
      <span class="location-tab-icon">🌟</span>
      <span>All Campus Zones</span>
      <span class="location-tab-count">${totalPlaces}</span>
    </button>
  `;

  CAMPUS_LOCATIONS.forEach(cat => {
    const isActive = state.activeLocationCategory === cat.id ? 'active' : '';
    html += `
      <button type="button" class="location-category-tab ${isActive}" data-cat-id="${cat.id}">
        <span class="location-tab-icon">${cat.icon}</span>
        <span>${escapeHtml(cat.name)}</span>
        <span class="location-tab-count">${cat.subcategories.length}</span>
      </button>
    `;
  });

  tabsContainer.innerHTML = html;

  tabsContainer.querySelectorAll('.location-category-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.location-category-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeLocationCategory = btn.getAttribute('data-cat-id') || 'all';
      renderPlacesGrid();
    });
  });
}

function renderPlacesGrid() {
  const grid = document.getElementById('places-grid');
  const badge = document.getElementById('locations-count-badge');
  if (!grid) return;

  const q = (state.locationSearchQuery || '').trim().toLowerCase();
  let matchedPlaces = [];

  CAMPUS_LOCATIONS.forEach(cat => {
    if (state.activeLocationCategory !== 'all' && state.activeLocationCategory !== cat.id) {
      return;
    }

    cat.subcategories.forEach(sub => {
      const matchSearch = !q || sub.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q);
      if (matchSearch) {
        matchedPlaces.push({
          category: cat.name,
          categoryId: cat.id,
          icon: cat.icon,
          name: sub
        });
      }
    });
  });

  if (badge) {
    const totalCategories = CAMPUS_LOCATIONS.length;
    badge.textContent = `${totalCategories} Categories • ${matchedPlaces.length} Places`;
  }

  if (matchedPlaces.length === 0) {
    grid.innerHTML = `
      <div class="places-empty-state">
        <span style="font-size: 32px;">🔍</span>
        <p>No college locations found matching "${escapeHtml(q)}".</p>
        <button type="button" class="btn-place-report" style="margin-top: 12px;" onclick="openReportModal('lost', '${escapeHtml(q).replace(/'/g, "\\'")}')">
          ➕ Report Item With Custom Location
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = matchedPlaces.map(p => `
    <div class="place-card">
      <div class="place-card-header">
        <div class="place-icon-box">${p.icon}</div>
        <div class="place-info">
          <h3 class="place-name">${escapeHtml(p.name)}</h3>
          <span class="place-category-label">${escapeHtml(p.category)}</span>
        </div>
      </div>
      <div class="place-actions">
        <button type="button" class="btn-place-filter" onclick="filterItemsByLocation('${escapeHtml(p.name).replace(/'/g, "\\'")}')">
          🔍 View Items
        </button>
        <button type="button" class="btn-place-report" onclick="openReportModal('lost', '${escapeHtml(p.name).replace(/'/g, "\\'")}')">
          ➕ Report Here
        </button>
      </div>
    </div>
  `).join('');
}

function initLocationSearch() {
  const searchInput = document.getElementById('locations-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    state.locationSearchQuery = e.target.value;
    renderPlacesGrid();
  });
}

function filterItemsByLocation(placeName) {
  state.filters.location = placeName;
  const locationSelect = document.getElementById('location-filter');
  if (locationSelect) {
    let found = false;
    for (let opt of locationSelect.options) {
      if (opt.value.toLowerCase() === placeName.toLowerCase()) {
        locationSelect.value = opt.value;
        found = true;
        break;
      }
    }
    if (!found) {
      locationSelect.value = 'all';
    }
  }

  loadItems();
  const browseSection = document.getElementById('browse-section');
  if (browseSection) {
    browseSection.scrollIntoView({ behavior: 'smooth' });
  }
}
window.filterItemsByLocation = filterItemsByLocation;

function populateLocationFilterDropdown() {
  const select = document.getElementById('location-filter');
  if (!select) return;

  let html = `<option value="all">📍 All Campus Locations</option>`;

  CAMPUS_LOCATIONS.forEach(cat => {
    html += `<optgroup label="${cat.icon} ${escapeHtml(cat.name)}">`;
    cat.subcategories.forEach(sub => {
      html += `<option value="${escapeHtml(sub)}">${escapeHtml(sub)}</option>`;
    });
    html += `</optgroup>`;
  });

  select.innerHTML = html;

  select.addEventListener('change', (e) => {
    state.filters.location = e.target.value;
    loadItems();
  });
}

function initReportModalLocationSelectors() {
  const catSelect = document.getElementById('report-location-category');
  const subSelect = document.getElementById('report-location-sub');
  const customWrap = document.getElementById('custom-location-wrap');
  const customInput = document.getElementById('report-location-custom');
  const detailInput = document.getElementById('report-location-detail');
  const hiddenLocation = document.getElementById('report-location');

  if (!catSelect || !subSelect || !hiddenLocation) return;

  let catHtml = `<option value="">-- Select Campus Zone / Building --</option>`;
  CAMPUS_LOCATIONS.forEach(cat => {
    catHtml += `<option value="${cat.id}">${cat.icon} ${escapeHtml(cat.name)}</option>`;
  });
  catSelect.innerHTML = catHtml;

  function updateHiddenLocation() {
    const catId = catSelect.value;
    const catObj = CAMPUS_LOCATIONS.find(c => c.id === catId);
    const subVal = (subSelect.value || '').trim();
    const customVal = customInput ? (customInput.value || '').trim() : '';
    const detailVal = detailInput ? (detailInput.value || '').trim() : '';

    let fullLoc = '';

    if (catId === 'other' || subVal.toLowerCase().includes('custom') || subVal.toLowerCase().includes('unlisted')) {
      fullLoc = customVal || 'Custom Campus Location';
    } else if (subVal) {
      fullLoc = subVal;
    } else if (catObj) {
      fullLoc = catObj.name;
    }

    if (detailVal && fullLoc) {
      fullLoc += ` (${detailVal})`;
    } else if (detailVal && !fullLoc) {
      fullLoc = detailVal;
    }

    hiddenLocation.value = fullLoc;
  }

  catSelect.addEventListener('change', () => {
    const catId = catSelect.value;
    const catObj = CAMPUS_LOCATIONS.find(c => c.id === catId);

    if (!catId || !catObj) {
      subSelect.innerHTML = `<option value="">-- First Select Zone --</option>`;
      subSelect.disabled = true;
      if (customWrap) customWrap.style.display = 'none';
      hiddenLocation.value = '';
      return;
    }

    subSelect.disabled = false;
    let subHtml = `<option value="">-- Select Specific Place / Room --</option>`;
    catObj.subcategories.forEach(sub => {
      subHtml += `<option value="${escapeHtml(sub)}">${escapeHtml(sub)}</option>`;
    });
    subSelect.innerHTML = subHtml;

    if (catId === 'other') {
      if (customWrap) customWrap.style.display = 'block';
    } else {
      if (customWrap) customWrap.style.display = 'none';
    }

    updateHiddenLocation();
  });

  subSelect.addEventListener('change', () => {
    const val = subSelect.value;
    if (val.toLowerCase().includes('custom') || val.toLowerCase().includes('unlisted')) {
      if (customWrap) customWrap.style.display = 'block';
      if (customInput) customInput.focus();
    } else {
      if (catSelect.value !== 'other' && customWrap) {
        customWrap.style.display = 'none';
      }
    }
    updateHiddenLocation();
  });

  if (customInput) customInput.addEventListener('input', updateHiddenLocation);
  if (detailInput) detailInput.addEventListener('input', updateHiddenLocation);
}

// ==========================================
// 5. REPORT MODAL & FORM SUBMISSION
// ==========================================

function openReportModal(defaultType = 'lost', prefillPlace = null) {
  const modal = document.getElementById('report-modal');
  if (!modal) return;

  const form = document.getElementById('report-item-form');
  if (form) form.reset();

  resetImageUpload();

  const customWrap = document.getElementById('custom-location-wrap');
  if (customWrap) customWrap.style.display = 'none';

  const typeRadio = document.querySelector(`input[name="report-type"][value="${defaultType}"]`);
  if (typeRadio) typeRadio.checked = true;

  const dateInput = document.getElementById('report-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  if (state.user) {
    const nameInput = document.getElementById('report-contact-name');
    if (nameInput) nameInput.value = state.user.name;
    const emailInput = document.getElementById('report-contact-email');
    if (emailInput) emailInput.value = state.user.email;
  }

  // Handle prefill campus location
  if (prefillPlace) {
    const catSelect = document.getElementById('report-location-category');
    const subSelect = document.getElementById('report-location-sub');
    const customWrap = document.getElementById('custom-location-wrap');
    const customInput = document.getElementById('report-location-custom');
    const hiddenLocation = document.getElementById('report-location');

    let matchedCat = null;
    let matchedSub = null;

    for (const cat of CAMPUS_LOCATIONS) {
      const match = cat.subcategories.find(s => s.toLowerCase() === prefillPlace.toLowerCase());
      if (match) {
        matchedCat = cat;
        matchedSub = match;
        break;
      }
    }

    if (matchedCat && catSelect && subSelect) {
      catSelect.value = matchedCat.id;
      let subHtml = `<option value="">-- Select Specific Place / Room --</option>`;
      matchedCat.subcategories.forEach(sub => {
        subHtml += `<option value="${escapeHtml(sub)}" ${sub === matchedSub ? 'selected' : ''}>${escapeHtml(sub)}</option>`;
      });
      subSelect.innerHTML = subHtml;
      subSelect.disabled = false;
      subSelect.value = matchedSub;
      if (hiddenLocation) hiddenLocation.value = matchedSub;
    } else if (catSelect && customInput) {
      catSelect.value = 'other';
      catSelect.dispatchEvent(new Event('change'));
      customInput.value = prefillPlace;
      if (hiddenLocation) hiddenLocation.value = prefillPlace;
    }
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
  const location = (formData.get('location') || document.getElementById('report-location')?.value || '').trim();
  const date = formData.get('date') || new Date().toISOString().split('T')[0];
  const description = (formData.get('description') || '').trim();
  const contactName = (formData.get('contactName') || '').trim();
  const contactEmail = (formData.get('contactEmail') || '').trim();
  const contactPhone = (formData.get('contactPhone') || '').trim();
  const image = (formData.get('image') || document.getElementById('report-image-data')?.value || '').trim();

  if (!title || !location) {
    showToast('Please provide both the item title and select a campus location.', 'error');
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
    image: image || null,
    contactName: contactName || (state.user ? state.user.name : 'Campus Student'),
    contactEmail: contactEmail || (state.user ? state.user.email : ''),
    contactPhone
  };

  try {
    const newItem = await createItemAPI(payload);
    resetImageUpload();
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

  // Handle Detail Image Display
  const imgWrapper = document.getElementById('detail-image-wrapper');
  const imgEl = document.getElementById('detail-image');
  if (imgWrapper && imgEl) {
    if (item.image) {
      imgEl.src = item.image;
      imgEl.alt = item.title;
      imgWrapper.style.display = 'block';
    } else {
      imgWrapper.style.display = 'none';
      imgEl.src = '';
    }
  }

  const rel = getUserItemRelationship(item);
  const roleBanner = document.getElementById('detail-role-banner');
  const deleteBtn = document.getElementById('detail-delete-btn');
  const contactBtn = document.getElementById('detail-contact-btn');
  const claimBtn = document.getElementById('detail-claim-btn');

  // Contact info privacy masking
  const emailEl = document.getElementById('detail-email');
  const phoneEl = document.getElementById('detail-phone');
  const reporterEl = document.getElementById('detail-reporter');

  if (rel.isAuthenticated) {
    emailEl.textContent = item.contactEmail || 'Not provided';
    phoneEl.textContent = item.contactPhone || 'Not provided';
    reporterEl.textContent = item.contactName || 'Campus Community Member';
  } else {
    // Mask contact details for signed-out guests
    const rawEmail = item.contactEmail || '';
    const maskedEmail = rawEmail.includes('@')
      ? rawEmail[0] + '***@' + rawEmail.split('@')[1]
      : 'Protected';
    emailEl.textContent = `${maskedEmail} (Sign in to view)`;
    phoneEl.textContent = 'Protected (Sign in to view)';
    reporterEl.textContent = item.contactName ? `${item.contactName.split(' ')[0]} (Verified Student)` : 'Campus Community Member';
  }

  document.getElementById('detail-category').innerHTML = `${icon} ${escapeHtml(item.category)}`;
  document.getElementById('detail-title').textContent = item.title;
  document.getElementById('detail-desc').textContent = item.description || 'No detailed description provided.';
  document.getElementById('detail-location').textContent = item.location;
  document.getElementById('detail-date').textContent = formatDate(item.date);

  const statusBadge = document.getElementById('detail-status');
  if (statusBadge) {
    statusBadge.className = `status-badge ${isClaimed ? 'badge-claimed' : (isLost ? 'badge-lost' : 'badge-found')}`;
    statusBadge.textContent = isClaimed ? 'CLAIMED / RECOVERED' : (isLost ? 'LOST ITEM' : 'FOUND ITEM');
  }

  // Option B: Dynamic Role Banner
  if (roleBanner) {
    if (isClaimed) {
      roleBanner.className = 'detail-resolved-banner';
      roleBanner.style.display = 'block';
      roleBanner.innerHTML = `✓ This item has been resolved and recovered${item.claimedBy ? ' by <strong>' + escapeHtml(item.claimedBy) + '</strong>' : ''}.`;
    } else if (rel.isOwner) {
      roleBanner.className = 'detail-owner-banner';
      roleBanner.style.display = 'block';
      roleBanner.innerHTML = `👤 <strong>Your Report:</strong> You posted this item. You can mark it resolved or delete this post.`;
    } else if (!rel.isAuthenticated) {
      roleBanner.className = 'detail-owner-banner';
      roleBanner.style.display = 'block';
      roleBanner.innerHTML = `🔒 <strong>Guest View:</strong> Sign in with your campus account to view full reporter contact details or claim this item.`;
    } else {
      roleBanner.style.display = 'none';
      roleBanner.innerHTML = '';
    }
  }

  // Option B: Modal Action Buttons
  if (deleteBtn) {
    if (rel.isOwner && !isClaimed) {
      deleteBtn.style.display = 'inline-block';
      deleteBtn.onclick = () => ownerDeleteItem(item.id);
    } else {
      deleteBtn.style.display = 'none';
    }
  }

  if (contactBtn) {
    if (rel.isAuthenticated && !rel.isOwner && item.contactEmail && !isClaimed) {
      contactBtn.style.display = 'inline-flex';
      contactBtn.href = `mailto:${encodeURIComponent(item.contactEmail)}?subject=${encodeURIComponent('Searchify Campus Lost & Found: ' + item.title)}`;
      contactBtn.textContent = `✉ Contact ${item.contactName ? item.contactName.split(' ')[0] : 'Reporter'}`;
    } else {
      contactBtn.style.display = 'none';
    }
  }

  if (claimBtn) {
    if (isClaimed) {
      claimBtn.style.display = 'none';
    } else if (!rel.isAuthenticated) {
      claimBtn.style.display = 'inline-block';
      claimBtn.className = 'btn-primary';
      claimBtn.textContent = '🔑 Sign In to Claim / Contact';
      claimBtn.onclick = () => {
        closeAllModals();
        openAuthModal();
      };
    } else if (rel.isOwner) {
      claimBtn.style.display = 'inline-block';
      claimBtn.className = 'btn-primary';
      claimBtn.textContent = '✓ Mark as Resolved';
      claimBtn.onclick = () => ownerResolveItem(item.id);
    } else {
      claimBtn.style.display = 'inline-block';
      claimBtn.className = 'btn-primary';
      claimBtn.textContent = isLost ? '✓ I Found This Item' : '✓ Claim This Item';
      claimBtn.onclick = () => studentClaimItem(item.id);
    }
  }

  modal.classList.add('modal-open');
}
window.openItemDetails = openItemDetails;

// ==========================================
// 7. IMAGE UPLOAD & OPTIMIZATION HELPERS
// ==========================================

let activeImageMode = 'file';

function switchImageTab(mode) {
  activeImageMode = mode;
  const fileTabBtn = document.getElementById('tab-btn-file');
  const urlTabBtn = document.getElementById('tab-btn-url');
  const dropzoneView = document.getElementById('image-dropzone-view');
  const urlView = document.getElementById('image-url-view');
  const previewBox = document.getElementById('image-preview-container');

  if (fileTabBtn) fileTabBtn.classList.toggle('active', mode === 'file');
  if (urlTabBtn) urlTabBtn.classList.toggle('active', mode === 'url');

  // If an image is currently attached and previewed, keep showing preview card
  const currentImg = document.getElementById('report-image-data')?.value;
  if (currentImg) {
    if (previewBox) previewBox.style.display = 'flex';
    if (dropzoneView) dropzoneView.style.display = 'none';
    if (urlView) urlView.style.display = 'none';
    return;
  }

  if (mode === 'file') {
    if (dropzoneView) dropzoneView.style.display = 'block';
    if (urlView) urlView.style.display = 'none';
  } else {
    if (dropzoneView) dropzoneView.style.display = 'none';
    if (urlView) urlView.style.display = 'block';
  }
}
window.switchImageTab = switchImageTab;

function initImageUpload() {
  const fileInput = document.getElementById('report-image-file');
  const dropzone = document.getElementById('image-dropzone');
  const urlInput = document.getElementById('report-image-url-input');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImageFile(file);
    });
  }

  if (dropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) {
        handleImageFile(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyImageUrl();
      }
    });
  }
}

function handleImageFile(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('Image size exceeds 10MB limit. Please choose a smaller file.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawDataUrl = e.target.result;
    // Auto-compress and scale to max 1200x1200px to ensure fast loads and fit well within storage
    compressImage(rawDataUrl, 1200, 1200, 0.82, (optimizedDataUrl) => {
      const sizeStr = formatBytes(Math.round(optimizedDataUrl.length * 0.75));
      setImagePreview(optimizedDataUrl, file.name, sizeStr);
      showToast('Photo attached successfully!', 'success');
    });
  };
  reader.onerror = () => {
    showToast('Could not read image file.', 'error');
  };
  reader.readAsDataURL(file);
}

function compressImage(dataUrl, maxWidth, maxHeight, quality, callback) {
  const img = new Image();
  img.onload = () => {
    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
      if (width / maxWidth > height / maxHeight) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const optimized = canvas.toDataURL('image/jpeg', quality);
      callback(optimized);
    } catch (err) {
      console.warn('Canvas compression fallback to raw dataUrl:', err);
      callback(dataUrl);
    }
  };
  img.onerror = () => {
    callback(dataUrl);
  };
  img.src = dataUrl;
}

function applyImageUrl() {
  const urlInput = document.getElementById('report-image-url-input');
  if (!urlInput) return;
  const url = urlInput.value.trim();

  if (!url) {
    showToast('Please paste a valid image URL.', 'error');
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    showToast('Image URL must start with http:// or https://', 'error');
    return;
  }

  showToast('Verifying image link...', 'info');
  const testImg = new Image();
  testImg.onload = () => {
    let shortName = 'Web Image';
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      shortName = parts.length > 0 ? parts[parts.length - 1] : u.hostname;
      if (shortName.length > 25) shortName = shortName.substring(0, 22) + '...';
    } catch (e) { }

    setImagePreview(url, shortName, 'Web URL');
    showToast('Image link attached!', 'success');
  };
  testImg.onerror = () => {
    showToast('Could not load image from this URL. Please check the link or CORS policy.', 'error');
  };
  testImg.src = url;
}
window.applyImageUrl = applyImageUrl;

function setImagePreview(src, filename, sizeLabel) {
  const previewBox = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('image-preview-img');
  const previewName = document.getElementById('preview-filename');
  const previewStatus = document.getElementById('preview-filesize');
  const hiddenData = document.getElementById('report-image-data');
  const dropzoneView = document.getElementById('image-dropzone-view');
  const urlView = document.getElementById('image-url-view');

  if (previewImg) previewImg.src = src;
  if (previewName) previewName.textContent = filename || 'Item Photo';
  if (previewStatus) previewStatus.textContent = sizeLabel ? `${sizeLabel} • Ready ✓` : 'Ready ✓';
  if (hiddenData) hiddenData.value = src;

  if (previewBox) previewBox.style.display = 'flex';
  if (dropzoneView) dropzoneView.style.display = 'none';
  if (urlView) urlView.style.display = 'none';
}

function removeSelectedImage() {
  const previewBox = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('image-preview-img');
  const hiddenData = document.getElementById('report-image-data');
  const fileInput = document.getElementById('report-image-file');
  const urlInput = document.getElementById('report-image-url-input');

  if (previewImg) previewImg.src = '';
  if (hiddenData) hiddenData.value = '';
  if (fileInput) fileInput.value = '';
  if (urlInput) urlInput.value = '';

  if (previewBox) previewBox.style.display = 'none';
  switchImageTab(activeImageMode || 'file');
}
window.removeSelectedImage = removeSelectedImage;

function resetImageUpload() {
  activeImageMode = 'file';
  removeSelectedImage();
}
window.resetImageUpload = resetImageUpload;

function formatBytes(bytes) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

// Option B Action Handlers: Owner Resolve, Owner Delete, and Student Claim
async function ownerResolveItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  if (!confirm(`Confirm that "${item.title}" has been recovered/resolved? This will close your report.`)) return;

  try {
    await claimItemAPI(id);
    closeAllModals();
    showToast('Your item has been marked as recovered & resolved!', 'success');
    await loadItems();
    await loadStats();
  } catch (err) {
    showToast('Failed to resolve report.', 'error');
  }
}
window.ownerResolveItem = ownerResolveItem;

async function ownerDeleteItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  if (!confirm(`Are you sure you want to permanently delete your report for "${item.title}"? This cannot be undone.`)) return;

  try {
    await deleteItemAPI(id);
    closeAllModals();
    showToast('Your item report has been permanently deleted.', 'info');
    await loadItems();
    await loadStats();
  } catch (err) {
    showToast('Failed to delete report. Please try again.', 'error');
  }
}
window.ownerDeleteItem = ownerDeleteItem;

async function studentClaimItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  if (!state.user) {
    showToast('Please sign in to claim this item or report it found.', 'info');
    openAuthModal();
    return;
  }

  const isLost = item.type === 'lost';
  const promptText = isLost
    ? `Have you found "${item.title}"? This will mark the item as recovered by you.`
    : `Is "${item.title}" your belonging? This will submit a claim for this item under ${state.user.name}.`;

  if (!confirm(promptText)) return;

  try {
    await claimItemAPI(id);
    closeAllModals();
    showToast(`Success! Item marked as ${isLost ? 'recovered & resolved' : 'claimed'}.`, 'success');
    await loadItems();
    await loadStats();
  } catch (err) {
    showToast('Failed to process claim. Please try again.', 'error');
  }
}
window.studentClaimItem = studentClaimItem;

async function confirmClaimItem(id) {
  await studentClaimItem(id);
}
window.confirmClaimItem = confirmClaimItem;

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
  } catch (e) { }
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
  } catch (e) { }

  renderUserNavbar();
  renderItems(state.items);
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
  } catch (e) { }
  renderUserNavbar();
  renderItems(state.items);
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
