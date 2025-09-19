const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);
console.log("DEBUG JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Auth/session middleware
const User = require('./models/User');
app.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      res.locals.user = user || null;
      req.user = user || null;
    } catch {
      res.locals.user = null;
      req.user = null;
    }
  } else {
    res.locals.user = null;
    req.user = null;
  }
  next();
});

// ✅ MongoDB connection


if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file or Render env vars.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Start server ONLY after DB connection
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 FlexBase server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Views & static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);
