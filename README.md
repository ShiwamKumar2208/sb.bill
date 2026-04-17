# SB Bill – Shobha Boutique Billing App

A lightweight, mobile-first Progressive Web App (PWA) designed for small boutique businesses to create, share, and manage bills effortlessly.

## 🚀 Features

- 🧾 **Instant Bill Generation**
  - Type items in free-form (e.g. `kurti 300`)
  - Auto-parses and calculates total

- ⚡ **Live Preview**
  - No buttons needed — updates while typing

- 📸 **Download Bill as Image**
  - Clean, styled invoice export

- 📤 **Share Bill**
  - Share directly via WhatsApp or other apps

- 💳 **UPI Payment Integration**
  - Dynamic QR code with auto-filled amount
  - Works with GPay, PhonePe, etc.

- 🔗 **Share UPI QR**
  - Send payment QR separately

- 🧾➕💳 **Share Bill + QR Together**
  - Merges bill and QR into a single image (best feature)

- 📱 **PWA Support**
  - Installable on mobile
  - Works offline

---

## 🧠 How It Works

- Items are parsed from text using simple regex
- Bill is rendered as HTML
- `html2canvas` converts UI → image
- QR is generated using UPI deep link:
  ```
  upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
  ```

---

## 📁 Project Structure

```
sb-bill/
├── index.html
├── app.js
├── style.css
├── manifest.json
├── sw.js
├── icons/
└── logo.png
```

---

## ⚙️ Setup

1. Clone repo
2. Open `index.html` in browser  
   OR deploy on Netlify

---

## 🔧 Configuration

Update UPI details in `app.js`:

```js
const upiId = "your-upi-id@bank";
const name = "Your Business Name";
```

---

## 📌 Notes

- No backend — everything runs locally
- Data is not stored (privacy-friendly)
- Designed for speed and simplicity

---

## 💡 Future Ideas

- Bill history (localStorage)
- Search by Bill ID
- Delivery date tracking
- QR inside bill layout

---

## 👤 Author

Built for real-world usage in a home boutique.  
Focused on **speed, simplicity, and usability over complexity**.

---

## 📜 License

MIT License
