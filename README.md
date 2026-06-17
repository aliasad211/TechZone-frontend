# TechZone Frontend 🛒

A modern **Electronics E-Commerce** web application built with **React.js**, featuring a full shopping experience with user authentication, product browsing, cart management, and an admin dashboard.

---

## 🔗 Related Repository

> **Backend API:** [TechZone-backend](https://github.com/aliasad211/TechZone-backend)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | API communication |
| React Hot Toast | Notifications |
| React Icons | Icon library |
| Context API | State management |

---

## 📁 Project Structure

```
TechZone-frontend/
├── public/
├── src/
│   ├── admin/
│   │   ├── AdminDashboard.js    # Stats & overview
│   │   ├── AdminProducts.js     # Manage products
│   │   ├── AdminAddProduct.js   # Add/edit product
│   │   ├── AdminOrders.js       # Manage orders
│   │   ├── AdminUsers.js        # Manage users
│   │   └── AdminLayout.js       # Admin sidebar layout
│   ├── components/
│   │   ├── Navbar.js            # Top navigation bar
│   │   └── Footer.js            # Footer
│   ├── context/
│   │   └── AppContext.js        # Global state (cart, auth, etc.)
│   ├── pages/
│   │   ├── HomePage.js          # Landing page with featured products
│   │   ├── ProductsPage.js      # All products with filters
│   │   ├── ProductDetailPage.js # Single product + reviews
│   │   ├── CartPage.js          # Shopping cart
│   │   ├── CheckoutPage.js      # Order checkout form
│   │   ├── OrderSuccessPage.js  # Order confirmation
│   │   ├── MyOrdersPage.js      # User order history
│   │   ├── OrderDetailPage.js   # Single order detail
│   │   ├── WishlistPage.js      # Saved products
│   │   ├── ProfilePage.js       # User profile
│   │   ├── LoginPage.js         # Login
│   │   └── RegisterPage.js      # Register
│   ├── utils/                   # Helper functions
│   ├── App.js                   # Routes configuration
│   └── index.js                 # Entry point
├── .gitignore
└── package.json
```

---

## ✨ Features

### 👤 User Features
- ✅ Register & Login with JWT authentication
- ✅ Browse products with search & category filter
- ✅ View product details with image gallery & specifications
- ✅ Add/remove products from Cart
- ✅ Wishlist / Save products
- ✅ Place orders (Checkout)
- ✅ View order history & order details
- ✅ Write product reviews & ratings
- ✅ Manage profile

### 🛡️ Admin Features
- ✅ Admin Dashboard with stats
- ✅ Add / Edit / Delete products (with Cloudinary image upload)
- ✅ Manage all orders & update status
- ✅ View & manage all users

### 🗂️ Product Categories
Mobiles · Laptops · Tablets · TVs · Audio · Cameras · Gaming · Accessories · Smart Home · Wearables

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aliasad211/TechZone-frontend.git
cd TechZone-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Backend setup

Make sure the **TechZone Backend** is running at `http://localhost:5000`.

> Backend repo: [TechZone-backend](https://github.com/aliasad211/TechZone-backend)

The frontend uses a **proxy** setting in `package.json` to forward API requests:

```json
"proxy": "http://localhost:5000"
```

### 4. Run the app

```bash
npm start
```

App will open at: `http://localhost:3000`

---

## 📄 Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Featured products, hero section |
| Products | `/products` | All products with filters |
| Product Detail | `/products/:id` | Product info, images, reviews |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Place order |
| Order Success | `/order-success` | Confirmation page |
| My Orders | `/my-orders` | Order history |
| Order Detail | `/orders/:id` | Single order info |
| Wishlist | `/wishlist` | Saved products |
| Profile | `/profile` | User account |
| Login | `/login` | Authentication |
| Register | `/register` | New account |
| Admin Dashboard | `/admin` | Admin panel |

---

## 🔐 Authentication

- JWT token stored in localStorage.
- Protected routes redirect unauthenticated users to login.
- Admin routes accessible only to users with `admin` role.

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `build/` folder.

---

## 👤 Author

**Ali Asad**
- GitHub: [@aliasad211](https://github.com/aliasad211)
- Email: info.aliasad785@gmail.com
