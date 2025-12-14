# 🛍️ Bringit  
High-End MERN Ecommerce Platform

Bringit is a full-stack ecommerce web application built using the MERN stack.  
It supports role-based authentication (Buyer / Seller), seller-driven product management, and a clean, premium UI.


## ✨ Key Features

### Authentication & Roles
- JWT-based authentication
- Role selection during signup:
  - Buyer
  - Seller
- Role-based access control enforced on backend and frontend

### Products
- Seller-only product creation
- Product listing page
- Client-side search
- Filter by category
- Sort products by:
  - Latest
  - Price (Low → High)
  - Price (High → Low)
- Stock management
- products are added manually by sellers

### Seller Capabilities
- Dedicated Seller Add Product page
- Only sellers can access add product route
- Product fields:
  - Name
  - Brand
  - Category
  - Image URL
  - Description
  - Price
  - Count in Stock

### Search Logic (Important)
- Search is implemented on the frontend
- Prevents false matches
- Ensures that:
  - If keyword is not present → product is not shown
  - Empty or whitespace keyword → all products are shown

### Orders 
- Order model included
- Ready for payment and order expansion


## 🧱 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Material UI 

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs


## 📁 Project Folder Structure

### Backend

server/
└── Node modules
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── productController.js
|   └── paymentController.js
|   └── orderController.js
├── middleware/
│   └── authMiddleware.js
|   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
|   └── paymentRoutes.js
|   └── orderRoutes.js
├── server.js
├── package.json
└── .env

### Frontend

client/
├── node_modules/
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Loader.jsx
│   │   ├── Message.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   ├── AddProductPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── RegisterPage.jsx
│   ├── state/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js

mongodb_url="mongodb+srv://adutta441:arnab@cluster0.j2gr0i5.mongodb.net/"
Backend_Deploylink=""
Frontend_Deploylink=""




