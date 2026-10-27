import express from "express";
import fetch from "node-fetch"; // Use native fetch in Node 18+
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:8080" })); // Allow requests from React app
app.use(express.json());

// Proxy route to Camunda
app.post("/api/camunda", async (req, res) => {
  try {
    const camundaUrl = "https://lhr-1.api.camunda.io/e8c76139-0b9c-4806-9f80-ac373d6a95b8/v2/process-instances"; // Update with your Camunda URL
    const token = process.env.CAMUNDA_AUTH_TOKEN; // Store token securely in .env

    const response = await fetch(camundaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Camunda auth token
      },
      body: JSON.stringify(req.body), // Forward frontend data
    });

    const text = await response.text();
    const cleanText = text ? text.trim() : "";
    const data = cleanText ? JSON.parse(cleanText) : {};
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Error calling Camunda:", err);
    res.status(500).json({ error: "Failed to call Camunda API" });
  }
});

app.post("/api/result", async (req, res) => {
  try {
    const camundaUrl = "https://lhr-1.api.camunda.io/e8c76139-0b9c-4806-9f80-ac373d6a95b8/v2/variables/search";
    const token = process.env.CAMUNDA_AUTH_TOKEN; // Store token securely in .env

    const response = await fetch(camundaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Camunda auth token
      },
      body: JSON.stringify(req.body), // Forward frontend data
    });

    const text = await response.text();
    const cleanText = text ? text.trim() : "";
    const data = cleanText ? JSON.parse(cleanText) : {};
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Error calling Camunda:", err);
    res.status(500).json({ error: "Failed to call Camunda API" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
