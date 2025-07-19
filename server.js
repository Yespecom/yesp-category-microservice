require("dotenv").config()
const express = require("express")
const cors = require("cors") // Import the cors package
const categoryRoutes = require("./routes/categoryRoutes")
const { connectMainDB } = require("./config/db") // Import connectMainDB

const app = express()

// Connect to the main database on server start (optional for category service, but good practice if it needs to interact with main DB)
connectMainDB()

app.use(cors()) // Use cors middleware to enable CORS for all routes
app.use(express.json()) // For parsing application/json
app.use("/api/categories", categoryRoutes)

app.get("/", (req, res) => {
  res.send("✅ YESP Category Microservice Running!")
})

const PORT = process.env.PORT || 5004
app.listen(PORT, () => console.log(`🚀 Category service running on port ${PORT}`))
