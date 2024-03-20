const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secretKey',
  resave: true,
  saveUninitialized: true
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
// Route to render index.ejs
app.get('/', (req, res) => {
    res.render('index');
});

// Route to render login.ejs
app.get('/login', (req, res) => {
    res.render('login');
});

// Route to render engineering.ejs
app.get('/engineering', (req, res) => {
  res.render('engineering');
});

// Route to render welcome.ejs
app.get('/welcome', (req, res) => {
  res.render('welcome');
});

// Route to render page specific to Computer Science branch
app.get('/cse-branch', (req, res) => {
  res.render('cse'); // Render the cse.ejs file
});






// Define routes for each year
app.get('/first_year', (req, res) => {
  res.render('first_year'); // Render first_year.ejs
});

app.get('/second_year', (req, res) => {
  res.render('second_year'); // Render second_year.ejs
});

app.get('/third_year', (req, res) => {
  res.render('third_year'); // Render third_year.ejs
});

app.get('/fourth_year', (req, res) => {
  res.render('fourth_year'); // Render fourth_year.ejs
});




// Route to handle signup form submission
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already in use');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle login form submission
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Check if user exists in the database
      const user = await User.findOne({ username });

      if (!user) {
          // User not found
          return res.send('<script>alert("Invalid username or password"); window.location.href = "/login";</script>');
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          // Password is incorrect
          return res.send('<script>alert("Invalid username or password"); window.location.href = "/login";</script>');
      }

      // Authentication successful, set session
      req.session.user = user;

      // Redirect to a dashboard or home page
      res.redirect('welcome'); // Change 'welcome' to your desired route
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Server run 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

