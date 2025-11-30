# AI E-Commerce Chat Assistant

This is an AI-powered E-Commerce Chat Assistant designed to help users with their shopping experience. It leverages natural language processing to understand user queries, recommend products, and assist with shopping tasks.

## 🚀 Features

- **Smart Product Search:** Users can ask for products using natural language (e.g., "Show me red sneakers under $50").
- **Real-time Assistance:** Instant responses to customer inquiries.
- **Responsive Design:** Built with TailwindCSS for a seamless mobile and desktop experience.
- **Fast Performance:** Powered by Vite for lightning-fast frontend tooling.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

**Database:**
- [MongoDB](https://www.mongodb.com/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VirtusDakura/E-Commerce-Chat-Assistant.git
   cd E-Commerce-Chat-Assistant
   ```

2. **Backend Setup**
   Navigate to the server directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   # Add other API keys (e.g., OpenAI) here
   ```

3. **Frontend Setup**
   Navigate to the client directory and install dependencies:
   ```bash
   cd frontend/ShopSmart
   npm install
   ```

## 🏃 Usage

**1. Start the Backend Server**
```bash
cd backend
npm start
```

**2. Start the Frontend Development Server**
```bash
cd frontend/ShopSmart
npm run dev
```

Visit `http://localhost:5173` (or the port shown in your terminal) to view the app.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License

This project is licensed under the MIT License.