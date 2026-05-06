# 🐄 Dairy Farm Management System — Firebase → MERN Conversion Guide

---

## STEP 1: What to Replace (Firebase → MERN Mapping)

| Firebase | MERN Replacement |
|---|---|
| `signInWithEmailAndPassword` | `POST /api/auth/login` (JWT) |
| `createUserWithEmailAndPassword` | `POST /api/auth/register` |
| `onAuthStateChanged` | JWT decode from localStorage |
| `Firestore addDoc / setDoc` | Mongoose `Model.create()` / `.save()` |
| `Firestore getDocs / getDoc` | Mongoose `.find()` / `.findById()` |
| `Firestore updateDoc` | Mongoose `.findByIdAndUpdate()` |
| `Firestore deleteDoc` | Mongoose `.findByIdAndDelete()` |
| `Firebase Storage` | Cloudinary upload via Multer |
| `FirebaseError` | Express error middleware |

---

## STEP 2: Backend — All Files

### 📁 Folder Structure

```
/server
  /config
    db.js
    cloudinary.js
  /models
    User.js
    Animal.js
    MilkRecord.js
    Product.js
    Cart.js
    Order.js
  /controllers
    authController.js
    animalController.js
    milkController.js
    productController.js
    cartController.js
    orderController.js
    userController.js
  /middlewares
    authMiddleware.js
    errorMiddleware.js
    uploadMiddleware.js
  /routes
    authRoutes.js
    animalRoutes.js
    milkRoutes.js
    productRoutes.js
    cartRoutes.js
    orderRoutes.js
    userRoutes.js
  server.js
  .env
```

---

### 📄 server/.env

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dairyfarm
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

---

### 📄 server/package.json

```json
{
  "name": "dairy-farm-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

### 📄 server/server.js

```js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/animals',  require('./routes/animalRoutes'));
app.use('/api/milk',     require('./routes/milkRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Dairy Farm API running ✅' }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### 📄 server/config/db.js

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### 📄 server/config/cloudinary.js

```js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'dairy-farm',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
```

---

### 📄 server/middlewares/authMiddleware.js

```js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect any route — must have valid JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Restrict to specific roles
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user.role}' is not authorized`);
  }
  next();
};

module.exports = { protect, authorize };
```

---

### 📄 server/middlewares/errorMiddleware.js

```js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
```

---

### 📄 server/middlewares/uploadMiddleware.js

```js
// Re-export upload from cloudinary config for clean imports in routes
const { upload } = require('../config/cloudinary');
module.exports = upload;
```

---

## MODELS

### 📄 server/models/User.js

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  avatar:   { type: String, default: '' },      // Cloudinary URL
  role:     { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password with hashed
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 📄 server/models/Animal.js

```js
const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  type:       { type: String, enum: ['cow', 'buffalo'], required: true },
  breed:      { type: String, default: '' },
  age:        { type: Number, default: 0 },
  weight:     { type: Number, default: 0 },
  image:      { type: String, default: '' },    // Cloudinary URL
  healthStatus: { type: String, enum: ['healthy', 'sick', 'recovering'], default: 'healthy' },
  addedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
```

---

### 📄 server/models/MilkRecord.js

```js
const mongoose = require('mongoose');

const milkRecordSchema = new mongoose.Schema({
  animal:   { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  date:     { type: Date, default: Date.now },
  morning:  { type: Number, default: 0 },   // litres
  evening:  { type: Number, default: 0 },
  total:    { type: Number },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-calculate total before save
milkRecordSchema.pre('save', function (next) {
  this.total = this.morning + this.evening;
  next();
});

module.exports = mongoose.model('MilkRecord', milkRecordSchema);
```

---

### 📄 server/models/Product.js

```js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, enum: ['milk', 'ghee', 'curd', 'paneer'], required: true },
  price:       { type: Number, required: true },
  unit:        { type: String, default: 'kg' },  // kg, litre, piece
  stock:       { type: Number, default: 0 },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
```

---

### 📄 server/models/Cart.js

```js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  price:    { type: Number },   // snapshot price at add time
});

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
```

---

### 📄 server/models/Order.js

```js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  price:    Number,
  quantity: Number,
  image:    String,
});

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:   [orderItemSchema],
  address: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    phone:   String,
  },
  payment: {
    method: { type: String, enum: ['COD', 'UPI'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    upiRef: String,
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
    default: 'placed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
```

---

## CONTROLLERS

### 📄 server/controllers/authController.js

```js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

// @POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

// @GET /api/auth/me  (protected)
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

// GET /api/animals
const getAnimals = asyncHandler(async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const animals = await Animal.find(filter).populate('addedBy', 'name');
  res.json({ success: true, animals });
});

// GET /api/animals/:id
const getAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  res.json({ success: true, animal });
});

// POST /api/animals
const createAnimal = asyncHandler(async (req, res) => {
  const image = req.file?.path || '';   // Cloudinary URL via multer
  const animal = await Animal.create({ ...req.body, image, addedBy: req.user._id });
  res.status(201).json({ success: true, animal });
});

// PUT /api/animals/:id
const updateAnimal = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.image = req.file.path;
  const animal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  res.json({ success: true, animal });
});

// DELETE /api/animals/:id
const deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  res.json({ success: true, message: 'Animal deleted' });
});

module.exports = { getAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal };
```

---

### 📄 server/controllers/milkController.js

```js
const asyncHandler = require('express-async-handler');
const MilkRecord = require('../models/MilkRecord');

// GET /api/milk  (optional ?animal=id&date=YYYY-MM-DD)
const getMilkRecords = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.animal) filter.animal = req.query.animal;
  if (req.query.date) {
    const d = new Date(req.query.date);
    filter.date = { $gte: d, $lt: new Date(d.getTime() + 86400000) };
  }
  const records = await MilkRecord.find(filter).populate('animal', 'name type').sort('-date');
  res.json({ success: true, records });
});

// POST /api/milk
const addMilkRecord = asyncHandler(async (req, res) => {
  const record = await MilkRecord.create({ ...req.body, recordedBy: req.user._id });
  res.status(201).json({ success: true, record });
});

// PUT /api/milk/:id
const updateMilkRecord = asyncHandler(async (req, res) => {
  const record = await MilkRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!record) { res.status(404); throw new Error('Record not found'); }
  res.json({ success: true, record });
});

// DELETE /api/milk/:id
const deleteMilkRecord = asyncHandler(async (req, res) => {
  await MilkRecord.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Record deleted' });
});

module.exports = { getMilkRecords, addMilkRecord, updateMilkRecord, deleteMilkRecord };
```

---

### 📄 server/controllers/productController.js

```js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const products = await Product.find(filter);
  res.json({ success: true, products });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

const createProduct = asyncHandler(async (req, res) => {
  const image = req.file?.path || '';
  const product = await Product.create({ ...req.body, image });
  res.status(201).json({ success: true, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.image = req.file.path;
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
```

---

### 📄 server/controllers/cartController.js

```js
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, cart: cart || { items: [] } });
});

// POST /api/cart  — add or update item
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  res.json({ success: true, cart });
});

// PUT /api/cart/:productId  — set exact quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (!item) { res.status(404); throw new Error('Item not in cart'); }

  item.quantity = quantity;
  await cart.save();
  res.json({ success: true, cart });
});

// DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json({ success: true, cart });
});

// DELETE /api/cart  — clear entire cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
```

---

### 📄 server/controllers/orderController.js

```js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// POST /api/orders  — place an order
const placeOrder = asyncHandler(async (req, res) => {
  const { items, address, payment, totalAmount } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    address,
    payment,
    totalAmount,
  });

  // Clear cart after order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, order });
});

// GET /api/orders/mine  — current user's orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, orders });
});

// GET /api/orders  — admin: all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json({ success: true, orders });
});

// PUT /api/orders/:id/status  — admin: update status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, order });
});

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
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

// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const update = { name, phone, address };
  if (req.file) update.avatar = req.file.path;

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
  res.json({ success: true, user });
});

// PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401); throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

module.exports = { getProfile, updateProfile, changePassword };
```

---

## ROUTES

### 📄 server/routes/authRoutes.js

```js
const express = require('express');
const router = express.Router();
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
const express = require('express');
const router = express.Router();
const { getAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/',      protect, getAnimals);
router.get('/:id',   protect, getAnimal);
router.post('/',     protect, authorize('owner', 'admin'), upload.single('image'), createAnimal);
router.put('/:id',   protect, authorize('owner', 'admin'), upload.single('image'), updateAnimal);
router.delete('/:id',protect, authorize('owner', 'admin'), deleteAnimal);

module.exports = router;
```

---

### 📄 server/routes/milkRoutes.js

```js
const express = require('express');
const router = express.Router();
const { getMilkRecords, addMilkRecord, updateMilkRecord, deleteMilkRecord } = require('../controllers/milkController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/',      protect, getMilkRecords);
router.post('/',     protect, authorize('owner', 'admin'), addMilkRecord);
router.put('/:id',   protect, authorize('owner', 'admin'), updateMilkRecord);
router.delete('/:id',protect, authorize('owner', 'admin'), deleteMilkRecord);

module.exports = router;
```

---

### 📄 server/routes/productRoutes.js

```js
const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/',       getProducts);          // Public — customers can browse
router.get('/:id',    getProduct);
router.post('/',      protect, authorize('owner', 'admin'), upload.single('image'), createProduct);
router.put('/:id',    protect, authorize('owner', 'admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProduct);

module.exports = router;
```

---

### 📄 server/routes/cartRoutes.js

```js
const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/',               protect, getCart);
router.post('/',              protect, addToCart);
router.put('/:productId',     protect, updateCartItem);
router.delete('/clear',       protect, clearCart);
router.delete('/:productId',  protect, removeFromCart);

module.exports = router;
```

---

### 📄 server/routes/orderRoutes.js

```js
const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/',             protect, placeOrder);
router.get('/mine',          protect, getMyOrders);
router.get('/',              protect, authorize('admin', 'owner'), getAllOrders);
router.put('/:id/status',    protect, authorize('admin', 'owner'), updateOrderStatus);

module.exports = router;
```

---

### 📄 server/routes/userRoutes.js

```js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/profile',         protect, getProfile);
router.put('/profile',         protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
```

---

## STEP 3: Frontend — API Service Layer + Context Updates

### 📄 client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 📄 client/src/services/api.js

```js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ────────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const fetchMe       = ()     => API.get('/auth/me');

// ─── ANIMALS ─────────────────────────────────────────
export const getAnimals    = (type) => API.get('/animals', { params: { type } });
export const getAnimal     = (id)   => API.get(`/animals/${id}`);
export const createAnimal  = (data) => API.post('/animals', data);        // FormData
export const updateAnimal  = (id, data) => API.put(`/animals/${id}`, data);
export const deleteAnimal  = (id)   => API.delete(`/animals/${id}`);

// ─── MILK ─────────────────────────────────────────────
export const getMilkRecords   = (params) => API.get('/milk', { params });
export const addMilkRecord    = (data)   => API.post('/milk', data);
export const updateMilkRecord = (id, d)  => API.put(`/milk/${id}`, d);
export const deleteMilkRecord = (id)     => API.delete(`/milk/${id}`);

// ─── PRODUCTS ────────────────────────────────────────
export const getProducts   = (category) => API.get('/products', { params: { category } });
export const getProduct    = (id)       => API.get(`/products/${id}`);
export const createProduct = (data)     => API.post('/products', data);   // FormData
export const updateProduct = (id, d)    => API.put(`/products/${id}`, d);
export const deleteProduct = (id)       => API.delete(`/products/${id}`);

// ─── CART ────────────────────────────────────────────
export const fetchCart       = ()              => API.get('/cart');
export const addToCart       = (productId, q)  => API.post('/cart', { productId, quantity: q });
export const updateCartItem  = (productId, q)  => API.put(`/cart/${productId}`, { quantity: q });
export const removeFromCart  = (productId)     => API.delete(`/cart/${productId}`);
export const clearCart       = ()              => API.delete('/cart/clear');

// ─── ORDERS ──────────────────────────────────────────
export const placeOrder        = (data) => API.post('/orders', data);
export const getMyOrders       = ()     => API.get('/orders/mine');
export const getAllOrders       = ()     => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// ─── USER ────────────────────────────────────────────
export const getProfile      = ()     => API.get('/users/profile');
export const updateProfile   = (data) => API.put('/users/profile', data);   // FormData
export const changePassword  = (data) => API.put('/users/change-password', data);
```

---

### 📄 client/src/context/AuthContext.jsx (Updated — replaces Firebase auth)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchMe } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — restore session from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Logged in successfully!');
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register
  const register = async (name, email, password, role = 'customer') => {
    try {
      const res = await registerUser({ name, email, password, role });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Account created!');
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

### 📄 client/src/context/CartContext.jsx (Updated — syncs with backend)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) loadCart();
    else setCart([]);
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await fetchCart();
      setCart(res.data.cart?.items || []);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await addToCart(productId, quantity);
      setCart(res.data.cart.items);
      toast.success('Added to cart');
    } catch (err) {
      toast.error('Could not add to cart');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const res = await updateCartItem(productId, quantity);
      setCart(res.data.cart.items);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data.cart.items);
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Could not remove item');
    }
  };

  const emptyCart = async () => {
    try {
      await clearCart();
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount   = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal   = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, cartTotal, addItem, updateItem, removeItem, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```

---

## STEP 4: End-to-End Integration Examples

### Example A — Login flow

**Before (Firebase):**
```js
// OLD
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);
```

**After (MERN):**
```jsx
// NEW — already handled inside AuthContext
const { login } = useAuth();
await login(email, password);  // Calls POST /api/auth/login, saves JWT
```

---

### Example B — Fetch products

**Before (Firebase):**
```js
// OLD
const q = query(collection(db, 'products'));
const snap = await getDocs(q);
const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
```

**After (MERN):**
```js
// NEW
import { getProducts } from '../services/api';
const res = await getProducts();
const products = res.data.products;
```

---

### Example C — Place order at Checkout

**Before (Firebase):**
```js
// OLD
await addDoc(collection(db, 'orders'), { ...orderData, userId: user.uid });
```

**After (MERN):**
```js
// NEW
import { placeOrder } from '../services/api';
await placeOrder({ items: cart, address, payment: { method: 'COD' }, totalAmount });
```

---

### Example D — Image upload for animal (FormData)

```jsx
// In your AddAnimal component:
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', name);
  formData.append('type', type);
  formData.append('breed', breed);
  formData.append('image', imageFile);   // <input type="file">

  try {
    await createAnimal(formData);
    toast.success('Animal added!');
  } catch (err) {
    toast.error('Failed to add animal');
  }
};
```

---

## STEP 5: Environment Files

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster0.mongodb.net/dairyfarm?retryWrites=true&w=majority
JWT_SECRET=dairyFarmSuperSecret2024!
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## STEP 6: Run Instructions

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install axios react-hot-toast
```
> Remove firebase packages:
```bash
npm uninstall firebase
```

### 3. Start Backend
```bash
cd server
npm run dev
```

### 4. Start Frontend
```bash
cd client
npm run dev
```

### 5. Verify API is running
Open: `http://localhost:5000/`  
Should return: `{ "message": "Dairy Farm API running ✅" }`

---

## STEP 7: Protected Route Component (No change needed to UI)

```jsx
// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
```

```jsx
// In App.jsx — wrap routes that need auth
<Route path="/dashboard" element={
  <ProtectedRoute roles={['owner', 'admin']}>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/checkout" element={
  <ProtectedRoute>
    <Checkout />
  </ProtectedRoute>
} />
```

---

## Summary Checklist

| Task | Status |
|---|---|
| Express server setup | ✅ |
| MongoDB + Mongoose | ✅ |
| JWT Auth (register/login/me) | ✅ |
| Role-based access (admin/owner/customer) | ✅ |
| Animal CRUD + Cloudinary images | ✅ |
| Milk record tracking | ✅ |
| Product CRUD | ✅ |
| Cart (DB-synced) | ✅ |
| Order placement (COD + UPI) | ✅ |
| User profile + password change | ✅ |
| API service layer (axios) | ✅ |
| AuthContext updated (JWT) | ✅ |
| CartContext updated (backend sync) | ✅ |
| Protected routes | ✅ |
| Error handling middleware | ✅ |
| Toast notifications | ✅ |
| .env files | ✅ |

**All Firebase logic is now replaced. UI remains untouched.**
