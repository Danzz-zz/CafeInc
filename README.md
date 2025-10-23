# CafeInc  -  Coffee Shop Website

Website company profile modern dan interaktif untuk toko kopi **CafeInc** dengan fitur e-commerce lengkap. Project ini dibuat sebagai tugas mata kuliah Pemrograman Web 1 yang mengimplementasikan HTML, CSS, JavaScript/jQuery, dan PHP.

##  Author

- Nama: Zidane Alfarizy
- NIM: 202310370311058
- Kelas: Pemrograman Web C


## Features

### Homepage (`index.html`)
- **Hero Section** dengan parallax effect dan smooth scroll indicator
- **About Section** dengan animated cards dan value propositions
- **Featured Products** dengan image hover zoom effects
- **Animated Statistics Counter** menampilkan achievements
- **Contact Form** dengan real-time validation dan PHP backend
- **Newsletter Subscription** di footer section

### Menu Page (`menu.html`)
- **Filter System** berdasarkan kategori (All, Espresso, Latte, Specialty, Iced, Non-Coffee)
- **Live Search** untuk mencari produk secara real-time
- **Product Grid** dengan hover effects dan product tags
- **Shopping Cart Sidebar** dengan slide-in animation
- **Add to Cart** functionality dengan button feedback
- **Quantity Controls** (increase/decrease) untuk setiap item
- **Remove Item** dan **Clear All** buttons
- **Real-time Total Calculation** menggunakan JavaScript
- **Floating Cart Button** dengan item count badge
- **LocalStorage Integration** untuk data persistence

### Checkout Page (`checkout.html`)
- **Order Summary** dengan detail item dan quantity controls
- **Real-time Price Calculation** (Subtotal + Delivery Fee)
- **Comprehensive Delivery Form** dengan validation
- **Payment Method Selection** (Cash on Delivery, Credit/Debit Card, Bank Transfer, QRIS)
- **Client-side & Server-side Validation**
- **AJAX Form Submission** untuk smooth user experience
- **Auto Order ID Generation** dengan timestamp
- **Success/Error Notifications**
- **Automatic Redirect** setelah order berhasil

## Tech yang digunakan

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure dan accessibility |
| **CSS3** | Custom styling, animations, responsive design |
| **JavaScript** | DOM manipulation, interactive features |
| **jQuery 3.6.0** | Simplified AJAX, event handling, animations |
| **PHP** | Backend form processing dan order management |
| **LocalStorage** | Cart data persistence tanpa database |
| **SVG Icons** | Vector graphics untuk tampilan profesional |

## Project Structure

```
CafeInc/
├── index.html              # Homepage dengan hero, about, featured products
├── menu.html               # Menu catalog dengan filter dan shopping cart
├── checkout.html           # Checkout page dengan form dan order summary
├── styles.css              # Main stylesheet (100% custom, no framework)
├── script.js               # JavaScript/jQuery untuk interactivity
├── contact.php             # Contact form handler dengan email notification
├── process_order.php       # Order processing dan validation
├── .gitignore             # Git ignore configuration
├── README.md              # Project documentation
├── images/
│   ├── hero/              # Hero section images
│   │   ├── hero-bg.jpg
│   │   ├── espresso.jpg
│   │   ├── latte.jpg
│   │   └── cappuccino.jpg
│   ├── menu/              # Product images (12 items)
│   │   ├── espresso.jpg
│   │   ├── americano.jpg
│   │   ├── cappuccino.jpg
│   │   ├── vanilla-latte.jpg
│   │   ├── hazelnut-latte.jpg
│   │   ├── caramel-macchiato.jpg
│   │   ├── iced-latte.jpg
│   │   ├── iced-americano.jpg
│   │   ├── cold-brew.jpg
│   │   ├── matcha-latte.jpg
│   │   ├── hot-chocolate.jpg
│   │   └── thai-tea.jpg
│   └── icons/             # SVG icons
│       ├── google-maps-platform-svgrepo-com.svg
│       ├── whatsapp-icon-logo-svgrepo-com.svg
│       ├── instagram-2016-logo-svgrepo-com.svg
│       └── clock.svg
└── orders/                # Order data storage (gitignored)
    ├── ORD-20241023-ABC123.json
    └── orders_log.txt
```

##  Installation & Setup

### Prerequisites
- **XAMPP** / **WAMP** / **LAMP** (untuk menjalankan PHP)
- Web browser modern (Chrome, Firefox, Edge, Safari)
- Text editor

### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/Danzz-zz/CafeInc.git
   cd CafeInc
   ```

2. **Pindahkan ke Server Folder**
   
   **XAMPP (Windows):**
   ```bash
   move CafeInc C:\xampp\htdocs\
   ```
   
   **WAMP (Windows):**
   ```bash
   move CafeInc C:\wamp64\www\
   ```
   
   **MAMP (macOS):**
   ```bash
   mv CafeInc /Applications/MAMP/htdocs/
   ```

3. **Buat Folder Orders**
   ```bash
   cd CafeInc
   mkdir orders
   chmod 755 orders  # untuk Linux/Mac
   ```

4. **Start Apache Server**
   - Buka XAMPP/WAMP Control Panel
   - Start Apache service
   - Pastikan port 80 tidak digunakan aplikasi lain

5. **Akses Website**
   ```
   http://localhost/CafeInc/
   ```

### GitHub Pages Deployment (Static Only)

1. Fork repository ini
2. Go to **Settings** → **Pages**
3. Source: Deploy from `main` branch
4. Save dan tunggu deployment selesai
5. Akses: `https://username.github.io/CafeInc/`

## Usage Guide

### 1. Browsing Menu
- Kunjungi halaman **Menu** dari navigasi
- Gunakan filter untuk kategori tertentu (Espresso, Latte, dll.)
- Ketik keyword di search bar untuk mencari produk
- Klik tombol **Add to Cart** untuk menambahkan item

### 2. Managing Cart
- Klik **floating cart button** di kanan bawah untuk membuka cart
- Gunakan tombol **+/-** untuk mengubah quantity
- Klik **Remove** untuk menghapus item tertentu
- Klik **Clear All** untuk mengosongkan seluruh cart
- Total price otomatis terupdate

### 3. Checkout Process
- Dari cart sidebar, klik tombol **Checkout**
- Review order summary Anda
- Isi form delivery information:
  - Full Name (minimal 3 karakter)
  - Email Address (format valid)
  - Phone Number (format Indonesia: 08xx)
  - Delivery Address (minimal 10 karakter)
  - Payment Method (pilih salah satu)
  - Order Notes (opsional)
- Klik **Place Order** untuk submit
- Order ID akan digenerate otomatis
- Cart akan otomatis dikosongkan setelah order berhasil

### 4. Contact Form
- Scroll ke bagian **Contact** di homepage
- Isi nama, email, subject, dan message
- Klik **Send Message**
- Email notification akan dikirim (jika PHP mail configured)

##  Features Highlights

### Client-Side JavaScript/jQuery
-  Smooth scroll navigation
-  Navbar scroll effect dengan class toggle
-  Live search dengan debouncing
-  Filter animation dengan fade effects
-  Shopping cart management
-  LocalStorage untuk data persistence
-  Form validation dengan regex patterns
-  Animated counter untuk statistics
-  Responsive hamburger menu
-  Hover effects dan transitions
-  Scroll-triggered animations

### Server-Side PHP
-  Contact form processing
-  Email notifications (template ready)
-  Data sanitization & validation
-  Order data storage (JSON format)
-  Payment method validation
-  Order logging system
-  Error handling dengan try-catch
-  Rate limiting untuk spam prevention
-  JSON responses untuk AJAX

### CSS Styling
-  no Bootstrap/Tailwind
-  Fully responsive (mobile-first approach)
-  CSS Variables untuk theming
-  Keyframe animations
-  Flexbox dan CSS Grid layouts
-  Pseudo-elements (::before, ::after)
-  Gradient backgrounds
-  Transform animations
-  Transition effects
- Media queries untuk multiple breakpoints
