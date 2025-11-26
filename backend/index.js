const express = require("express");
const app = express();

app.use(express.json());

// basic test route
app.get("/", (req, res) => {
  res.send("ShopGenius API is alive ⚡");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
