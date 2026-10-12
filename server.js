const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'items.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default mock items if file doesn't exist
const DEFAULT_ITEMS = [
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
    "type": "found",
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

function readItems() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_ITEMS, null, 2), 'utf-8');
      return DEFAULT_ITEMS;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading items file:', err);
    return DEFAULT_ITEMS;
  }
}

function writeItems(items) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing items file:', err);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

// Route root to index.html (with fallback)
app.get('/', (req, res) => {
  const htmlFile = fs.existsSync(path.join(__dirname, 'index.html'))
    ? 'index.html'
    : 'lost&found.html';
  res.sendFile(path.join(__dirname, htmlFile));
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Get portal statistics
app.get('/api/stats', (req, res) => {
  const items = readItems();
  const totalLost = items.filter(item => item.type === 'lost').length;
  const totalFound = items.filter(item => item.type === 'found').length;
  const totalClaimed = items.filter(item => item.status === 'claimed').length;
  const totalItems = items.length;

  // Base campus statistics + dynamic current session increments
  const baseLost = 150 + totalLost;
  const baseFound = 90 + totalFound;
  const calculatedRate = totalItems > 0 
    ? Math.round(85 + (totalClaimed / totalItems) * 10) 
    : 89;

  res.json({
    lostItems: baseLost,
    foundItems: baseFound,
    successRate: `${Math.min(99, calculatedRate)}%`,
    activeUsers: '500+',
    liveCounts: {
      total: totalItems,
      lost: totalLost,
      found: totalFound,
      claimed: totalClaimed,
      active: totalItems - totalClaimed
    }
  });
});

// Get items with filtering & search
app.get('/api/items', (req, res) => {
  let items = readItems();
  const { type, category, status, search } = req.query;

  if (type && type !== 'all') {
    items = items.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

  if (category && category !== 'all') {
    items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'all') {
    items = items.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    items = items.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    count: items.length,
    items
  });
});

// Get single item by ID
app.get('/api/items/:id', (req, res) => {
  const items = readItems();
  const item = items.find(i => i.id === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json(item);
});

// Create new item (Report Lost or Found)
app.post('/api/items', (req, res) => {
  const { title, type, category, location, date, description, contactName, contactEmail, contactPhone } = req.body;

  if (!title || !type || !category || !location) {
    return res.status(400).json({ error: 'Missing required fields: title, type, category, and location are mandatory.' });
  }

  const items = readItems();
  const newItem = {
    id: `item-${Date.now()}`,
    title: title.trim(),
    type: type.toLowerCase() === 'found' ? 'found' : 'lost',
    category: category.trim(),
    location: location.trim(),
    date: date || new Date().toISOString().split('T')[0],
    description: (description || '').trim(),
    contactName: (contactName || 'Anonymous Student').trim(),
    contactEmail: (contactEmail || '').trim(),
    contactPhone: (contactPhone || '').trim(),
    status: 'active',
    createdAt: new Date().toISOString()
  };

  items.unshift(newItem);
  writeItems(items);

  res.status(201).json({
    message: `${newItem.type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
    item: newItem
  });
});

// Claim or resolve an item
app.patch('/api/items/:id/claim', (req, res) => {
  const items = readItems();
  const itemIndex = items.findIndex(i => i.id === req.params.id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items[itemIndex].status = 'claimed';
  items[itemIndex].claimedAt = new Date().toISOString();
  if (req.body.claimedBy) {
    items[itemIndex].claimedBy = req.body.claimedBy;
  }

  writeItems(items);

  res.json({
    message: 'Item status updated to Claimed/Resolved!',
    item: items[itemIndex]
  });
});

// Delete an item
app.delete('/api/items/:id', (req, res) => {
  let items = readItems();
  const initialLength = items.length;
  items = items.filter(i => i.id !== req.params.id);

  if (items.length === initialLength) {
    return res.status(404).json({ error: 'Item not found' });
  }

  writeItems(items);
  res.json({ message: 'Item deleted successfully.' });
});

// Mock Authentication Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Provide mock authenticated session
  const name = email.split('@')[0].replace(/[._]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  res.json({
    token: `mock-jwt-token-${Date.now()}`,
    user: {
      email,
      name: name || 'Campus Student',
      studentId: 'STU-2024-8842',
      avatar: '🎓'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, studentId } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  res.status(201).json({
    token: `mock-jwt-token-${Date.now()}`,
    user: {
      name,
      email,
      studentId: studentId || 'STU-2024-NEW',
      avatar: '🎓'
    }
  });
});

// Reset mock data endpoint
app.post('/api/reset', (req, res) => {
  writeItems(DEFAULT_ITEMS);
  res.json({ message: 'Mock data reset to original defaults', items: DEFAULT_ITEMS });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Searchify Lost & Found Server running on port ${PORT}`);
  console.log(`Access website: http://localhost:${PORT}`);
  console.log(`API base endpoint: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
