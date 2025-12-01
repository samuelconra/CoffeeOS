import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to CoffeeOS");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
});
