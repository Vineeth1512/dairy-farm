# 🐄 Dairy Farm — Actual Firebase → MERN Conversion
## Based on YOUR exact codebase

---

## WHAT I FOUND IN YOUR PROJECT

| File | Current Firebase Usage |
|---|---|
| `Config/FirebaseConfiguration.jsx` | `initializeApp`, `getAuth`, `getFirestore` |
| `Context/AuthProvider.jsx` | `doc`, `getDoc` from Firestore (role-based fetch) |
| `Pages/Login/Login.jsx` | `signInWithEmailAndPassword`, `getDoc` |
| `Pages/Signup/Signup.jsx` | `createUserWithEmailAndPassword`, `updateProfile`, `setDoc` |
| `hooks/useOwnerData.jsx` | `collection`, `getDocs` — fetches all owners' animals/milk/products |
| `hooks/useUserData.jsx` | `doc`, `getDoc` — fetches cart/wishlist/orders |
| `Components/Dashboard/OwnerDashboard/AddAnimal/AddAnimal.jsx` | `updateDoc`, `arrayUnion` |
| `Components/Dashboard/OwnerDashboard/AddMilk/AddMilk.jsx` | `updateDoc`, `arrayUnion` |
| `Components/Dashboard/OwnerDashboard/AddMilkProducts/AddMilkProducts.jsx` | `updateDoc`, `arrayUnion` |
| `Components/Dashboard/OwnerDashboard/AllAnimals/AllAnimals.jsx` | `getDoc`, `updateDoc` |
| `Components/Dashboard/OwnerDashboard/AllMilkItems/AllMilkItems.jsx` | `getDoc`, `updateDoc` |
| `Components/Dashboard/UserDashboard/Cart/Cart.jsx` | `updateDoc` (increment/decrement/delete) |
| `Components/Dashboard/UserDashboard/WishList/WishList.jsx` | `getDoc`, `updateDoc`, `arrayUnion` |
| `Components/Dashboard/UserDashboard/Orders/Orders.jsx` | `getDoc` |
| `Components/Dashboard/UserDashboard/DisplayProducts/Cattles/SingleCattle.jsx` | `getDoc`, `updateDoc`, `arrayUnion` |
| `Components/Modals/CheckoutModal.jsx` | `getDoc`, `updateDoc`, `arrayUnion` |
| `Components/Modals/EditProfile.jsx` | `setDoc`, `updateProfile` (Firebase Auth) |
| `Components/Navbar/Navbar.jsx` | `signOut(auth)` |
| `utils/uploadImageToCloudinary.jsx` | Direct Cloudinary unsigned upload (keep this!) |

**Key insight:** Your data model uses Firestore with owners and users as top-level collections,
where each user document has arrays (animals, milk, products, cart, wishlist, orders) embedded inside.
The MERN backend separates all of these into proper MongoDB collections.

Your image upload already uses Cloudinary unsigned preset directly from frontend — we can keep that!

---

## STEP 1: BACKEND — Complete Server

### Install dependencies
```bash
mkdir server && cd server
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv express-async-handler
npm install -D nodemon
```

---

### 📄 server/.env
```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/dairyfarm?retryWrites=true&w=majority
JWT_SECRET=dairyFarmSecret2024!
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### 📄 server/server.js
```js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/animals',  require('./routes/animalRoutes'));
app.use('/api/milk',     require('./routes/milkRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));

app.get('/', (req, res) => res.json({ message: '🐄 Dairy Farm API running!' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

---

### 📄 server/config/db.js
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### 📄 server/middlewares/authMiddleware.js
```js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) { res.status(401); throw new Error('Not authorized'); }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401); throw new Error('Token invalid');
  }
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403); throw new Error('Access denied');
  }
  next();
};

module.exports = { protect, authorize };
```

---

### 📄 server/middlewares/errorMiddleware.js
```js
const errorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
module.exports = { errorHandler };
```

---

### 📄 server/models/User.js
```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Matches your existing Firestore fields: name, email, role, profile
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'owner'], default: 'user' }, // matches your signup "user" / "owner"
  profile:  { type: String, default: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 📄 server/models/Animal.js
```js
const mongoose = require('mongoose');

// Matches your existing Firestore animal fields exactly
const animalSchema = new mongoose.Schema({
  breed:        { type: String, required: true },
  type:         { type: String, enum: ['cow', 'buffalo'], required: true },
  age:          { type: String, default: '' },
  color:        { type: String, default: '' },
  birth:        { type: String, default: '' },
  milkCapacity: { type: String, default: '' },
  price:        { type: String, required: true },
  image:        { type: String, default: '' },
  quantity:     { type: Number, default: 1 },
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
```

---

### 📄 server/models/MilkItem.js
```js
const mongoose = require('mongoose');

// Matches your Firestore milk fields
const milkItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  quantity:    { type: String, default: '' },
  fat:         { type: String, default: '' },
  price:       { type: String, required: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('MilkItem', milkItemSchema);
```

---

### 📄 server/models/Product.js
```js
const mongoose = require('mongoose');

// Matches your AddMilkProducts fields: name, category, price, description, image
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, enum: ['ghee', 'curd', 'paneer', 'milk'], required: true },
  quantity:    { type: String, default: '' },
  price:       { type: String, required: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
```

---

### 📄 server/models/Cart.js
```js
const mongoose = require('mongoose');

// Cart item stores the full item snapshot (matches your existing cart structure)
const cartItemSchema = new mongoose.Schema({
  itemId:   { type: String },          // original Date.now() id from your code
  name:     String,
  breed:    String,
  price:    mongoose.Schema.Types.Mixed,
  image:    String,
  quantity: { type: Number, default: 1 },
  type:     String,                    // 'cattle', 'milk', 'product'
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
```

---

### 📄 server/models/WishList.js
```js
const mongoose = require('mongoose');

const wishItemSchema = new mongoose.Schema({
  itemId:   String,
  name:     String,
  breed:    String,
  price:    mongoose.Schema.Types.Mixed,
  image:    String,
  quantity: { type: Number, default: 1 },
  type:     String,
}, { _id: false });

const wishListSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [wishItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('WishList', wishListSchema);
```

---

### 📄 server/models/Order.js
```js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId:   String,
  name:     String,
  breed:    String,
  price:    mongoose.Schema.Types.Mixed,
  image:    String,
  quantity: Number,
  type:     String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items:         [orderItemSchema],
  address:       { type: String, required: true },
  paymentMethod: { type: String, enum: ['cod', 'upi'], default: 'cod' },
  total:         Number,
  gst:           String,
  status:        { type: String, default: 'placed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
```

---

### 📄 server/controllers/authController.js
```js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
// Matches your Signup.jsx: name, email, password, role ('user' or 'owner')
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({ name, email, password, role: role || 'user' });
  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile },
  });
});

// POST /api/auth/login
// Matches your Login.jsx — returns role so frontend can redirect to correct dashboard
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  res.json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
```

---

### 📄 server/controllers/animalController.js
```js
const asyncHandler = require('express-async-handler');
const Animal = require('../models/Animal');

// GET /api/animals — all animals (public for user browse)
const getAnimals = asyncHandler(async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const animals = await Animal.find(filter).lean();
  // Add id field matching your frontend's Date.now() id expectation
  res.json({ success: true, animals });
});

// GET /api/animals/mine — owner's own animals
const getMyAnimals = asyncHandler(async (req, res) => {
  const animals = await Animal.find({ owner: req.user._id }).lean();
  res.json({ success: true, animals });
});

// POST /api/animals — owner adds animal
const createAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, animal });
});

// DELETE /api/animals/:id
const deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  res.json({ success: true, message: 'Animal deleted' });
});

// PUT /api/animals/:id
const updateAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body, { new: true }
  );
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  res.json({ success: true, animal });
});

module.exports = { getAnimals, getMyAnimals, createAnimal, deleteAnimal, updateAnimal };
```

---

### 📄 server/controllers/milkController.js
```js
const asyncHandler = require('express-async-handler');
const MilkItem = require('../models/MilkItem');

const getMilkItems = asyncHandler(async (req, res) => {
  const milkItems = await MilkItem.find().lean();
  res.json({ success: true, milkItems });
});

const getMyMilkItems = asyncHandler(async (req, res) => {
  const milkItems = await MilkItem.find({ owner: req.user._id }).lean();
  res.json({ success: true, milkItems });
});

const createMilkItem = asyncHandler(async (req, res) => {
  const milkItem = await MilkItem.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, milkItem });
});

const deleteMilkItem = asyncHandler(async (req, res) => {
  await MilkItem.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  res.json({ success: true, message: 'Milk item deleted' });
});

module.exports = { getMilkItems, getMyMilkItems, createMilkItem, deleteMilkItem };
```

---

### 📄 server/controllers/productController.js
```js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const products = await Product.find(filter).lean();
  res.json({ success: true, products });
});

const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ owner: req.user._id }).lean();
  res.json({ success: true, products });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = { getProducts, getMyProducts, createProduct, deleteProduct };
```

---

### 📄 server/controllers/cartController.js
```js
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json({ success: true, cart: cart?.items || [] });
});

// POST /api/cart/add — add item (matches your SingleCattle.jsx addToCart logic)
const addToCart = asyncHandler(async (req, res) => {
  const { item } = req.body; // full item object from frontend
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  // Prevent duplicate (same itemId)
  const exists = cart.items.some(i => i.itemId === item.itemId || i.itemId === String(item.id));
  if (exists) {
    return res.status(409).json({ success: false, message: 'Item already in cart' });
  }

  cart.items.push({ ...item, itemId: String(item.id || item.itemId) });
  await cart.save();
  res.json({ success: true, cart: cart.items });
});

// PUT /api/cart/update — update quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.find(i => i.itemId === itemId);
  if (item) item.quantity = quantity;
  await cart.save();
  res.json({ success: true, cart: cart.items });
});

// DELETE /api/cart/:itemId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  cart.items = cart.items.filter(i => i.itemId !== req.params.itemId);
  await cart.save();
  res.json({ success: true, cart: cart.items });
});

// DELETE /api/cart/clear
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, cart: [] });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
```

---

### 📄 server/controllers/wishlistController.js
```js
const asyncHandler = require('express-async-handler');
const WishList = require('../models/WishList');

const getWishList = asyncHandler(async (req, res) => {
  const wishlist = await WishList.findOne({ user: req.user._id });
  res.json({ success: true, wishlist: wishlist?.items || [] });
});

const addToWishList = asyncHandler(async (req, res) => {
  const { item } = req.body;
  let wishlist = await WishList.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new WishList({ user: req.user._id, items: [] });

  const exists = wishlist.items.some(i => i.itemId === String(item.id || item.itemId));
  if (exists) return res.status(409).json({ success: false, message: 'Already in wishlist' });

  wishlist.items.push({ ...item, itemId: String(item.id || item.itemId) });
  await wishlist.save();
  res.json({ success: true, wishlist: wishlist.items });
});

const removeFromWishList = asyncHandler(async (req, res) => {
  const wishlist = await WishList.findOne({ user: req.user._id });
  if (!wishlist) { res.status(404); throw new Error('Wishlist not found'); }
  wishlist.items = wishlist.items.filter(i => i.itemId !== req.params.itemId);
  await wishlist.save();
  res.json({ success: true, wishlist: wishlist.items });
});

module.exports = { getWishList, addToWishList, removeFromWishList };
```

---

### 📄 server/controllers/orderController.js
```js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// POST /api/orders
const placeOrder = asyncHandler(async (req, res) => {
  const { items, address, paymentMethod, total, gst } = req.body;
  const order = await Order.create({ user: req.user._id, items, address, paymentMethod, total, gst });
  // Clear cart after order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json({ success: true, order });
});

// GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, orders });
});

module.exports = { placeOrder, getMyOrders };
```

---

### 📄 server/controllers/userController.js
```js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/users/profile — matches your EditProfile.jsx (name, profile image URL)
const updateProfile = asyncHandler(async (req, res) => {
  const { name, profile } = req.body;
  const update = {};
  if (name) update.name = name;
  if (profile) update.profile = profile;

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
  res.json({ success: true, user });
});

module.exports = { getProfile, updateProfile };
```

---

### 📄 server/routes/authRoutes.js
```js
const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);

module.exports = router;
```

---

### 📄 server/routes/animalRoutes.js
```js
const router = require('express').Router();
const { getAnimals, getMyAnimals, createAnimal, deleteAnimal, updateAnimal } = require('../controllers/animalController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/',       getAnimals);                                    // Public — user browse
router.get('/mine',   protect, authorize('owner'), getMyAnimals);     // Owner's own animals
router.post('/',      protect, authorize('owner'), createAnimal);
router.put('/:id',    protect, authorize('owner'), updateAnimal);
router.delete('/:id', protect, authorize('owner'), deleteAnimal);

module.exports = router;
```

---

### 📄 server/routes/milkRoutes.js
```js
const router = require('express').Router();
const { getMilkItems, getMyMilkItems, createMilkItem, deleteMilkItem } = require('../controllers/milkController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/',       getMilkItems);
router.get('/mine',   protect, authorize('owner'), getMyMilkItems);
router.post('/',      protect, authorize('owner'), createMilkItem);
router.delete('/:id', protect, authorize('owner'), deleteMilkItem);

module.exports = router;
```

---

### 📄 server/routes/productRoutes.js
```js
const router = require('express').Router();
const { getProducts, getMyProducts, createProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/',       getProducts);
router.get('/mine',   protect, authorize('owner'), getMyProducts);
router.post('/',      protect, authorize('owner'), createProduct);
router.delete('/:id', protect, authorize('owner'), deleteProduct);

module.exports = router;
```

---

### 📄 server/routes/cartRoutes.js
```js
const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/',            protect, getCart);
router.post('/add',        protect, addToCart);
router.put('/update',      protect, updateCartItem);
router.delete('/clear',    protect, clearCart);
router.delete('/:itemId',  protect, removeFromCart);

module.exports = router;
```

---

### 📄 server/routes/wishlistRoutes.js
```js
const router = require('express').Router();
const { getWishList, addToWishList, removeFromWishList } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/',           protect, getWishList);
router.post('/add',       protect, addToWishList);
router.delete('/:itemId', protect, removeFromWishList);

module.exports = router;
```

---

### 📄 server/routes/orderRoutes.js
```js
const router = require('express').Router();
const { placeOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/',     protect, placeOrder);
router.get('/mine',  protect, getMyOrders);

module.exports = router;
```

---

### 📄 server/routes/userRoutes.js
```js
const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile',  protect, getProfile);
router.put('/profile',  protect, updateProfile);

module.exports = router;
```

---

## STEP 2: FRONTEND — Replace Firebase with Axios

### Install
```bash
cd your-dairy-farm-project
npm uninstall firebase
npm install axios react-hot-toast
```

---

### 📄 src/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 📄 src/Services/api.js  ← NEW FILE (replaces Firebase calls)
```js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Auto-attach JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ─────────────────────────────────────────────────
export const apiRegister = (data) => API.post('/auth/register', data);
export const apiLogin    = (data) => API.post('/auth/login', data);
export const apiGetMe    = ()     => API.get('/auth/me');

// ── ANIMALS ──────────────────────────────────────────────
export const apiGetAnimals   = ()        => API.get('/animals');
export const apiGetMyAnimals = ()        => API.get('/animals/mine');
export const apiAddAnimal    = (data)    => API.post('/animals', data);
export const apiDeleteAnimal = (id)      => API.delete(`/animals/${id}`);
export const apiUpdateAnimal = (id, d)   => API.put(`/animals/${id}`, d);

// ── MILK ─────────────────────────────────────────────────
export const apiGetMilk    = ()     => API.get('/milk');
export const apiGetMyMilk  = ()     => API.get('/milk/mine');
export const apiAddMilk    = (data) => API.post('/milk', data);
export const apiDeleteMilk = (id)   => API.delete(`/milk/${id}`);

// ── PRODUCTS ─────────────────────────────────────────────
export const apiGetProducts   = ()     => API.get('/products');
export const apiGetMyProducts = ()     => API.get('/products/mine');
export const apiAddProduct    = (data) => API.post('/products', data);
export const apiDeleteProduct = (id)   => API.delete(`/products/${id}`);

// ── CART ─────────────────────────────────────────────────
export const apiGetCart      = ()       => API.get('/cart');
export const apiAddToCart    = (item)   => API.post('/cart/add', { item });
export const apiUpdateCart   = (itemId, quantity) => API.put('/cart/update', { itemId, quantity });
export const apiRemoveCart   = (itemId) => API.delete(`/cart/${itemId}`);
export const apiClearCart    = ()       => API.delete('/cart/clear');

// ── WISHLIST ─────────────────────────────────────────────
export const apiGetWishList    = ()       => API.get('/wishlist');
export const apiAddToWishList  = (item)   => API.post('/wishlist/add', { item });
export const apiRemoveWishList = (itemId) => API.delete(`/wishlist/${itemId}`);

// ── ORDERS ───────────────────────────────────────────────
export const apiPlaceOrder  = (data) => API.post('/orders', data);
export const apiGetMyOrders = ()     => API.get('/orders/mine');

// ── USER ─────────────────────────────────────────────────
export const apiGetProfile    = ()     => API.get('/users/profile');
export const apiUpdateProfile = (data) => API.put('/users/profile', data);
```

---

### 📄 src/Config/FirebaseConfiguration.jsx  ← DELETE this file

Remove it completely. Replace any import in components with the api.js service.

---

### 📄 src/Context/AuthProvider.jsx  ← REPLACE ENTIRELY

```jsx
// src/Context/AuthProvider.jsx
// REPLACED: Firebase Firestore doc/getDoc with JWT + API calls
import { createContext, useEffect, useState } from 'react';
import { apiLogin, apiRegister, apiGetMe } from '../Services/api';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(null);
  const [loading, setLoading]     = useState(true);

  // fetchLoginData — re-used across the app via useProfile()
  // Replaces: getDoc(doc(db, role, displayName))
  const fetchLoginData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoginData(null); setLoading(false); return; }
    try {
      const res = await apiGetMe();
      setLoginData(res.data.user);
      // Store in localStorage so Navbar and other components can read role
      const role = res.data.user.role;
      if (role === 'owner') {
        localStorage.setItem('ownerLoggedIn', JSON.stringify({ user: { displayName: res.data.user.name, email: res.data.user.email } }));
        localStorage.removeItem('userLoggedIn');
      } else {
        localStorage.setItem('userLoggedIn', JSON.stringify({ user: { displayName: res.data.user.name, email: res.data.user.email } }));
        localStorage.removeItem('ownerLoggedIn');
      }
    } catch {
      setLoginData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginData();
  }, []);

  return (
    <AuthContext.Provider value={{ loginData, setLoginData, fetchLoginData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 📄 src/hooks/useOwnerData.jsx  ← REPLACE ENTIRELY

```jsx
// src/hooks/useOwnerData.jsx
// REPLACED: collection(db, 'owners') getDocs with API calls
import { useEffect, useState } from 'react';
import { apiGetAnimals, apiGetMilk, apiGetProducts } from '../Services/api';

export const useOwnerData = () => {
  const [cattle, setCattle]       = useState([]);
  const [milk, setMilk]           = useState([]);
  const [milkItems, setMilkItems] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [animalsRes, milkRes, productsRes] = await Promise.all([
          apiGetAnimals(),
          apiGetMilk(),
          apiGetProducts(),
        ]);
        // Add id field for frontend compatibility (your code uses item.id for cart)
        setCattle(animalsRes.data.animals.map(a => ({ ...a, id: a._id })));
        setMilk(milkRes.data.milkItems.map(m => ({ ...m, id: m._id })));
        setMilkItems(productsRes.data.products.map(p => ({ ...p, id: p._id })));
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { cattle, milk, milkItems, loading };
};
```

---

### 📄 src/hooks/useUserData.jsx  ← REPLACE ENTIRELY

```jsx
// src/hooks/useUserData.jsx
// REPLACED: Firestore getDoc(doc(db,'users',displayName)) with API calls
import { useState } from 'react';
import { apiGetCart, apiGetWishList } from '../Services/api';

export const useUserData = () => {
  const [wishListCount, setwishListCount] = useState(0);
  const [cartCount, setCartCount]         = useState([]);
  const [wishList, setWishList]           = useState([]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setwishListCount(0);
      setCartCount([]);
      return;
    }
    try {
      const [cartRes, wishRes] = await Promise.all([apiGetCart(), apiGetWishList()]);
      setCartCount(cartRes.data.cart || []);
      setWishList(wishRes.data.wishlist || []);
      setwishListCount((wishRes.data.wishlist || []).length);
    } catch (err) {
      console.error(err);
    }
  };

  return { wishListCount, cartCount, wishList, setwishListCount, setCartCount, setWishList, fetchUserData };
};
```

---

### 📄 src/Pages/Login/Login.jsx  ← REPLACE Firebase calls only

```jsx
import React, { useState } from 'react';
import ShowPassword from '../../Components/ShowPassword/ShowPassword';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useProfile } from '../../hooks/useProfile';
import OwnerGuestLogin from './GuestLogin/OwnerGuestLogin';
import UserGuestLogin from './GuestLogin/UserGuestLogin';
import CustomButton from '../../Components/CustomButton/CustomButton';
import logoImage from '../../assets/images/logo.png';
import { apiLogin } from '../../Services/api';

const Login = ({ fetchWishListCount }) => {
  const { fetchLoginData } = useProfile();
  const navigate = useNavigate();

  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    if (!loginDetails.email || !loginDetails.password) {
      toast.error('Please Fill All Fields');
      return;
    }

    try {
      // REPLACED: signInWithEmailAndPassword + getDoc
      const res = await apiLogin({ email: loginDetails.email, password: loginDetails.password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);

      // Maintain your existing localStorage structure so rest of app still works
      const localUserObj = { user: { displayName: user.name, email: user.email } };
      if (user.role === 'owner') {
        localStorage.setItem('ownerLoggedIn', JSON.stringify(localUserObj));
        localStorage.removeItem('userLoggedIn');
      } else {
        localStorage.setItem('userLoggedIn', JSON.stringify(localUserObj));
        localStorage.removeItem('ownerLoggedIn');
      }

      toast.success('Logged In Successfully');
      await fetchWishListCount();
      await fetchLoginData();

      setTimeout(() => navigate(`/${user.role}Dashboard`), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ──────────────────────────────────────────────────────────
  // UI UNCHANGED — copy your exact JSX below this line
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0] px-4">
      <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-[radial-gradient(circle,#f7a974,#9e673d)] p-8 flex-col justify-center items-center text-center">
          <img src={logoImage} alt="Illustration" className="w-full h-auto mb-6 rounded" />
          <h2 className="text-xl font-semibold text-[#6e4327] mb-2">Manage Your Dairy Smarter.</h2>
          <p className="text-sm text-gray-600">Buy, sell, and monitor cattle — all in one place.</p>
        </div>
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#6e4327]">Login to your Account</h2>
            <p className="text-sm text-gray-500 mt-1">See what is going on with your business</p>
          </div>
          <form onSubmit={handleLoginFormSubmit}>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text text-[#6e4327] font-semibold">Email</span></label>
              <input type="email" placeholder="john@example.com" className="input input-bordered w-full"
                onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })} />
            </div>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text text-[#6e4327] font-semibold">Password</span></label>
              <ShowPassword value={loginDetails.password}
                onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })} />
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox checkbox-sm" /><span>Remember Me</span>
              </label>
              <Link to="/forgotPassword" className="text-[#6e4327] hover:underline">Forgot Password?</Link>
            </div>
            <CustomButton type="submit" className="btn bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000] w-full mb-4">Login</CustomButton>
            <div className="flex flex-col sm:flex-row justify-center">
              <OwnerGuestLogin className="w-full sm:w-auto flex-1" />
              <UserGuestLogin fetchWishListCount={fetchWishListCount} className="w-full sm:w-auto flex-1" />
            </div>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600">
            Not Registered Yet?{' '}
            <Link to="/signup" className="text-[#6e4327] font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
```

---

### 📄 src/Pages/Signup/Signup.jsx  ← REPLACE Firebase calls only

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import logoImage from '../../assets/images/logo.png';
import ShowPassword from '../../Components/ShowPassword/ShowPassword.jsx';
import CustomButton from '../../Components/CustomButton/CustomButton.jsx';
import { apiRegister } from '../../Services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signupDetails, setSignupDetails] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!signupDetails.role) { toast.error('Please select a role.'); return; }
    if (signupDetails.password !== signupDetails.confirmPassword) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      // REPLACED: createUserWithEmailAndPassword + setDoc
      await apiRegister({
        name:     signupDetails.name,
        email:    signupDetails.email,
        password: signupDetails.password,
        role:     signupDetails.role,
      });

      toast.success(`${signupDetails.role.toUpperCase()} SignUp Successful`);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  // UI UNCHANGED — exact same JSX as before
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0] px-4">
        <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="hidden md:block md:w-1/2 bg-[radial-gradient(circle,#f7a974,#9e673d)] p-8 flex-col justify-center items-center text-center">
            <img src={logoImage} alt="Illustration" className="w-full h-auto mb-6 rounded" />
            <h2 className="text-xl font-semibold text-[#6e4327] mb-2">Manage Your Dairy Smarter.</h2>
            <p className="text-sm text-gray-600">Buy, sell, and monitor cattle — all in one place.</p>
          </div>
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-[#6e4327]">Create your Account</h2>
              <p className="text-sm text-gray-500 mt-1">Start your dairy journey today!</p>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-control mb-4 text-[#6e4327]">
                <label className="label"><span className="label-text text-[#6e4327] font-semibold">Full Name</span></label>
                <input type="text" placeholder="John Doe" className="input input-bordered" required
                  onChange={(e) => setSignupDetails({ ...signupDetails, name: e.target.value })} />
              </div>
              <div className="form-control mb-4">
                <label className="label"><span className="label-text text-[#6e4327] font-semibold">Email</span></label>
                <input type="email" placeholder="john@example.com" className="input input-bordered" required
                  onChange={(e) => setSignupDetails({ ...signupDetails, email: e.target.value })} />
              </div>
              <div className="form-control mb-6">
                <label className="label"><span className="label-text text-[#6e4327] font-semibold">Password</span></label>
                <ShowPassword value={signupDetails.password}
                  onChange={(e) => setSignupDetails({ ...signupDetails, password: e.target.value })} />
              </div>
              <div className="form-control mb-6">
                <label className="label"><span className="label-text text-[#6e4327] font-semibold">Confirm Password</span></label>
                <ShowPassword value={signupDetails.confirmPassword}
                  onChange={(e) => setSignupDetails({ ...signupDetails, confirmPassword: e.target.value })} />
              </div>
              <div className="form-control mb-6">
                <label className="label"><span className="label-text text-[#6e4327] font-semibold">Role</span></label>
                <select className="select select-bordered"
                  onChange={(e) => setSignupDetails({ ...signupDetails, role: e.target.value })}>
                  <option value="">Choose a Role</option>
                  <option value="owner">Owner</option>
                  <option value="user">User</option>
                </select>
              </div>
              <CustomButton type="submit" className="btn w-full bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000]" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </CustomButton>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6e4327] font-semibold hover:underline">Login here</Link>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Signup;
```

---

### 📄 src/Components/Dashboard/OwnerDashboard/AddAnimal/AddAnimal.jsx

Change **only** the submit handler. Keep all UI + Cloudinary upload unchanged:

```jsx
// REPLACE ONLY the handleAnimalFormSubmit function:

import { apiAddAnimal } from '../../../../Services/api';  // ADD THIS IMPORT

const handleAnimalFormSubmit = async (e) => {
  e.preventDefault();

  try {
    // REPLACED: updateDoc(doc(db,'owners',displayName), { animals: arrayUnion(...) })
    await apiAddAnimal(animalFormData);
    toast.success('Animal Data added Successfully..');
    setTimeout(() => navigate('/ownerDashboard'), 1500);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

// REMOVE these imports:
// import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
// import { db } from '../../../../Config/FirebaseConfiguration';
// REMOVE: const loggedInOwner = JSON.parse(localStorage.getItem('ownerLoggedIn'));
```

---

### 📄 src/Components/Dashboard/OwnerDashboard/AddMilk/AddMilk.jsx

```jsx
// REPLACE ONLY the handleMilkFormSubmit function:

import { apiAddMilk } from '../../../../Services/api';

const handleMilkFormSubmit = async (e) => {
  e.preventDefault();

  try {
    // REPLACED: updateDoc(doc(db,'owners',displayName), { milk: arrayUnion(...) })
    await apiAddMilk(milkDetails);
    toast.success('Milk Item added Successfully..');
    setTimeout(() => navigate('/ownerDashboard'), 1500);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};
```

---

### 📄 src/Components/Dashboard/OwnerDashboard/AddMilkProducts/AddMilkProducts.jsx

```jsx
// REPLACE ONLY the submit handler:

import { apiAddProduct } from '../../../../Services/api';

const handleMilkProductFormSubmit = async (e) => {
  e.preventDefault();

  try {
    await apiAddProduct(milkProductDetails);
    toast.success('Milk Product added Successfully..');
    setTimeout(() => navigate('/ownerDashboard'), 1500);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};
```

---

### 📄 src/Components/Dashboard/OwnerDashboard/AllAnimals/AllAnimals.jsx

```jsx
// REPLACE the useEffect + handleDeleteAnimal:

import { apiGetMyAnimals, apiDeleteAnimal } from '../../../../Services/api';

useEffect(() => {
  const fetchAllAnimals = async () => {
    try {
      // REPLACED: getDoc(doc(db,'owners',displayName))
      const res = await apiGetMyAnimals();
      setAllAnimals(res.data.animals || []);
    } catch (err) {
      toast.error('Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };
  fetchAllAnimals();
}, []);

const handleDeleteAnimal = async (animalId) => {
  try {
    // REPLACED: updateDoc(docRef, { animals: updated })
    await apiDeleteAnimal(animalId);
    toast.success('Animal Deleted Successfully.');
    setAllAnimals(prev => prev.filter(a => a._id !== animalId));
  } catch (err) {
    toast.error('Delete failed');
  }
};

// In JSX — change onClick to pass _id not index:
// onClick={() => handleDeleteAnimal(animal._id)}
```

---

### 📄 src/Components/Dashboard/OwnerDashboard/AllMilkItems/AllMilkItems.jsx

```jsx
// REPLACE useEffect + handleDeleteItem:

import { apiGetMyMilk, apiDeleteMilk } from '../../../../Services/api';

useEffect(() => {
  const fetchAllMilkItems = async () => {
    try {
      const res = await apiGetMyMilk();
      setAllMilkItems(res.data.milkItems || []);
    } catch (err) {
      toast.error('Failed to fetch milk items');
    } finally {
      setLoading(false);
    }
  };
  fetchAllMilkItems();
}, []);

const handleDeleteItem = async (milkId) => {
  try {
    await apiDeleteMilk(milkId);
    toast.success('Milk Item Deleted Successfully!');
    setAllMilkItems(prev => prev.filter(m => m._id !== milkId));
  } catch (err) {
    toast.error('Delete failed');
  }
};
// In JSX: onClick={() => handleDeleteItem(milk._id)}
```

---

### 📄 src/Components/Dashboard/UserDashboard/Cart/Cart.jsx

```jsx
// REPLACE handleIncrement, handleDecrement, deleteCartItem:

import { apiUpdateCart, apiRemoveCart } from '../../../../Services/api';

const handleIncrement = async (itemId) => {
  const item = cartData.find(i => i.id === itemId || i.itemId === String(itemId));
  const newQty = item.quantity + 1;
  const updatedCart = cartData.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
  setCardData(updatedCart);
  setCartItems(updatedCart);
  // REPLACED: updateDoc(doc(db,'users',displayName), { cart: updatedCart })
  await apiUpdateCart(String(itemId), newQty);
};

const handleDecrement = async (itemId) => {
  const item = cartData.find(i => i.id === itemId || i.itemId === String(itemId));
  if (item.quantity <= 1) return;
  const newQty = item.quantity - 1;
  const updatedCart = cartData.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
  setCardData(updatedCart);
  setCartItems(updatedCart);
  await apiUpdateCart(String(itemId), newQty);
};

const deleteCartItem = async (deleteItem) => {
  if (confirm('Are you sure you want to delete?')) {
    const itemId = String(deleteItem.id || deleteItem.itemId);
    const afterDelete = cartData.filter(c => c.id !== deleteItem.id);
    // REPLACED: updateDoc(doc(db,'users',displayName), { cart: afterDelete })
    await apiRemoveCart(itemId);
    setCardData(afterDelete);
    setCartItems(afterDelete);
  }
};

// REMOVE: import { doc, updateDoc } from 'firebase/firestore';
// REMOVE: import { db } from '../../../../Config/FirebaseConfiguration';
// REMOVE: const loggedInUser = JSON.parse(localStorage.getItem('userLoggedIn'));
```

---

### 📄 src/Components/Dashboard/UserDashboard/WishList/WishList.jsx

```jsx
// REPLACE useEffect + handleAddToCart + handleDeleteWishList:

import { apiGetWishList, apiAddToCart, apiRemoveWishList } from '../../../../Services/api';

useEffect(() => {
  const fetchWishList = async () => {
    try {
      // REPLACED: getDoc(doc(db,'users',displayName))
      const res = await apiGetWishList();
      const data = res.data.wishlist || [];
      setWishList(data);
      setWishListData(data);
      setwishListCount(data.length);
    } catch (err) {
      console.error(err);
    }
  };
  fetchWishList();
}, []);

const handleAddToCart = async (item) => {
  try {
    // REPLACED: getDoc + arrayUnion + updateDoc for cart
    await apiAddToCart(item);
    setCartCount(prev => [...prev, item]);
    toast.success('Item Added to the Cart..');
  } catch (err) {
    if (err.response?.status === 409) toast.info('This item is already in your cart.');
    else toast.error('Failed to add to cart');
  }
};

// For delete from wishlist:
const handleRemoveFromWishList = async (item) => {
  const itemId = String(item.id || item.itemId);
  await apiRemoveWishList(itemId);
  setWishListData(prev => prev.filter(w => w.itemId !== itemId));
  setwishListCount(prev => prev - 1);
};
```

---

### 📄 src/Components/Dashboard/UserDashboard/DisplayProducts/Cattles/SingleCattle.jsx

```jsx
// REPLACE handleAddToCart:

import { apiAddToCart } from '../../../../../Services/api';

const handleAddToCart = async (item) => {
  const token = localStorage.getItem('token');
  if (!token) { toast.error('Please log in to add to cart.'); return; }

  try {
    // REPLACED: getDoc + arrayUnion + updateDoc
    await apiAddToCart({ ...item, id: item.id || item._id });
    const res = await apiGetCart();
    setCartCount(res.data.cart);
    toast.success('Item Added to the Cart..');
  } catch (err) {
    if (err.response?.status === 409) toast.info('This item is already in your cart.');
    else toast.error(err.response?.data?.message || 'Failed to add to cart');
  }
};
```

---

### 📄 src/Components/Modals/CheckoutModal.jsx

```jsx
// REPLACE handleConfirmOrder:

import { apiPlaceOrder, apiClearCart } from '../../Services/api';

const handleConfirmOrder = async () => {
  if (!address) { alert('Please enter your delivery address.'); return; }
  setIsProcessing(true);

  try {
    const newOrder = {
      items: cartItems,
      address,
      paymentMethod,
      total,
      gst,
    };

    // REPLACED: getDoc + updateDoc({ orders: arrayUnion, cart: [] })
    await apiPlaceOrder(newOrder);
    await apiClearCart();

    setCartItems([]);
    setOrderPlaced(true);
    alert('Order placed successfully!');
    onClose();
    navigate('/');
  } catch (err) {
    toast.error('Something went wrong while placing the order.');
  } finally {
    setIsProcessing(false);
  }
};

// Keep all motion/animation UI unchanged
```

---

### 📄 src/Components/Dashboard/UserDashboard/Orders/Orders.jsx

```jsx
// REPLACE useEffect:

import { apiGetMyOrders } from '../../../../Services/api';

useEffect(() => {
  const fetchOrdersData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }

      // REPLACED: getDoc(doc(db,'users',displayName))
      const res = await apiGetMyOrders();
      setOrdersData(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchOrdersData();
}, []);

// In JSX — order.timestamp → order.createdAt (MongoDB stores it as createdAt):
// {new Date(order.createdAt).toLocaleString()}
// order.id → order._id
```

---

### 📄 src/Components/Modals/EditProfile.jsx

```jsx
// REPLACE handleUpdateProfile:

import { apiUpdateProfile } from '../../Services/api';

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  try {
    const updatePayload = { name };
    if (profile) updatePayload.profile = profile;

    // REPLACED: setDoc(docRef, ...) + updateProfile(auth.currentUser, ...)
    await apiUpdateProfile(updatePayload);

    // Update localStorage displayName
    const stored = JSON.parse(localStorage.getItem('ownerLoggedIn') || localStorage.getItem('userLoggedIn') || '{}');
    if (stored?.user) {
      stored.user.displayName = name;
      const key = loginData?.role === 'owner' ? 'ownerLoggedIn' : 'userLoggedIn';
      localStorage.setItem(key, JSON.stringify(stored));
    }

    await fetchLoginData();
    toast.success('Profile updated successfully');
    onCancel();
  } catch (err) {
    toast.error('Failed to update profile');
  }
};

// REMOVE: import { auth, db } from '../../Config/FirebaseConfiguration';
// REMOVE: import { doc, setDoc } from 'firebase/firestore';
// REMOVE: import { updateProfile } from 'firebase/auth';
```

---

### 📄 src/Components/Navbar/Navbar.jsx

```jsx
// REPLACE handleLogout:

const handleLogout = async (e) => {
  e.preventDefault();
  try {
    // REPLACED: signOut(auth)
    localStorage.removeItem('token');
    localStorage.removeItem('ownerLoggedIn');
    localStorage.removeItem('userLoggedIn');
    setShowModal(false);
    setwishListCount(0);
    setCartCount(0);
    fetchLoginData();
    navigate('/login');
  } catch (err) {
    toast.error(err.message);
  }
};

// REMOVE: import { signOut } from 'firebase/auth';
// REMOVE: import { auth } from '../../Config/FirebaseConfiguration';
```

---

### 📄 src/Pages/Login/GuestLogin/OwnerGuestLogin.jsx  ← UPDATE

```jsx
// Your guest login sets ownerLoggedIn in localStorage.
// Replace with a real guest account login using your API:

import { apiLogin } from '../../../Services/api';

// In the handler:
const handleOwnerGuestLogin = async () => {
  try {
    const res = await apiLogin({ email: 'guestowner@dairy.com', password: 'GuestOwner@123' });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('ownerLoggedIn', JSON.stringify({ user: { displayName: res.data.user.name, email: res.data.user.email } }));
    localStorage.removeItem('userLoggedIn');
    navigate('/ownerDashboard');
  } catch {
    toast.error('Guest login failed');
  }
};
// Create a guest owner account in your DB manually (POST /api/auth/register with role:'owner')
```

---

## STEP 3: main.jsx — Remove firebase, Add Toaster

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthProvider.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className="font-merriweather">
          <Toaster position="top-right" />
          <App />
        </div>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
```

---

## STEP 4: Files to Delete

```
❌ src/Config/FirebaseConfiguration.jsx
❌ src/Pages/Login/ForgotPassword/ForgotPassword.jsx  (uses sendPasswordResetEmail — rebuild or remove)
```

---

## STEP 5: Run Instructions

```bash
# Terminal 1 — Start backend
cd server
npm install
npm run dev   # runs on http://localhost:5000

# Terminal 2 — Start frontend
cd dairy-farm   (your existing project root)
npm install axios react-hot-toast
npm uninstall firebase
npm run dev   # runs on http://localhost:5173
```

---

## STEP 6: Create Guest Accounts in DB

```bash
# After backend is running, create guest accounts via Postman or curl:

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Guest Owner","email":"guestowner@dairy.com","password":"GuestOwner@123","role":"owner"}'

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Guest User","email":"guestuser@dairy.com","password":"GuestUser@123","role":"user"}'
```

---

## Summary of All Changes

| File | Change |
|---|---|
| `Config/FirebaseConfiguration.jsx` | ❌ DELETE |
| `Context/AuthProvider.jsx` | ✅ Full rewrite (JWT) |
| `hooks/useOwnerData.jsx` | ✅ Full rewrite (API calls) |
| `hooks/useUserData.jsx` | ✅ Full rewrite (API calls) |
| `Pages/Login/Login.jsx` | ✅ Replace `signInWithEmailAndPassword` only |
| `Pages/Signup/Signup.jsx` | ✅ Replace `createUserWithEmailAndPassword` + `setDoc` |
| `Dashboard/AddAnimal/AddAnimal.jsx` | ✅ Replace submit handler only |
| `Dashboard/AddMilk/AddMilk.jsx` | ✅ Replace submit handler only |
| `Dashboard/AddMilkProducts/AddMilkProducts.jsx` | ✅ Replace submit handler only |
| `Dashboard/AllAnimals/AllAnimals.jsx` | ✅ Replace fetch + delete |
| `Dashboard/AllMilkItems/AllMilkItems.jsx` | ✅ Replace fetch + delete |
| `Dashboard/Cart/Cart.jsx` | ✅ Replace increment/decrement/delete |
| `Dashboard/WishList/WishList.jsx` | ✅ Replace fetch + add/remove |
| `Dashboard/Orders/Orders.jsx` | ✅ Replace fetch |
| `Cattles/SingleCattle.jsx` | ✅ Replace addToCart |
| `Modals/CheckoutModal.jsx` | ✅ Replace placeOrder |
| `Modals/EditProfile.jsx` | ✅ Replace updateProfile |
| `Navbar/Navbar.jsx` | ✅ Replace signOut |
| `Services/api.js` | ✅ NEW FILE |
| `utils/uploadImageToCloudinary.jsx` | ✅ KEEP AS IS |

**Zero UI changes. Every Tailwind class, every animation, every component structure is preserved.**
