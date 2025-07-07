const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/medical_registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// JWT Secret Key (em produção, use uma variável de ambiente)
const JWT_SECRET = 'your_jwt_secret_key';

// Models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);

//const cors = require('cors');
app.use(cors());

const RegistrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  bloodType: String,
  emergencyContact: String,
  allergies: String,
  medications: String,
  illnesses: String,
  surgeries: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Registration = mongoose.model('Registration', RegistrationSchema);

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Medical Registration (protegida por autenticação)
app.post('/api/medical-register', async (req, res) => {
  try {
    // Verificar token JWT (implementar middleware de autenticação em produção)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verificar token
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Criar registro médico associado ao usuário
    const data = new Registration({ ...req.body, user: userId });
    await data.save();
    
    res.status(201).json({ message: 'Medical data registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving medical data', error: error.message });
  }
});

// Middleware de autenticação (para uso em rotas protegidas)
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Obter perfil do usuário
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const medicalData = await Registration.findOne({ user: req.user._id });
    
    res.json({
      user,
      medicalData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Gerar dados para QR Code
app.get('/api/qr-data', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const medicalData = await Registration.findOne({ user: req.user._id });
    
    const qrData = {
      user: {
        username: user.username,
        email: user.email
      },
      medicalData
    };
    
    res.json(qrData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR data', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});