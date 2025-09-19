// routes/auth.js or in your main app file
const authController = require('../controllers/authController');

// Public routes
app.get('/login', authController.renderLogin);
app.get('/register', authController.renderRegister);
app.post('/login', authController.loginUser);
app.post('/register', authController.registerUser);
app.post('/logout', authController.logoutUser);

// Protected routes - use authenticateToken middleware
app.get('/', authController.authenticateToken, (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/collections', authController.authenticateToken, (req, res) => {
  res.render('collections', { user: req.user });
});

// Optional: Routes that work for both authenticated and non-authenticated users
app.get('/explore', authController.checkAuth, (req, res) => {
  res.render('explore', { 
    user: req.user, 
    isAuthenticated: req.isAuthenticated 
  });
});

// API endpoint to get current user
app.get('/api/user', authController.authenticateToken, authController.getCurrentUser);
