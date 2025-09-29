import app from "./app.docker.js";
import cloudinary from "cloudinary";
import promBundle from "express-prom-bundle";
import path from "path";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Prometheus metrics middleware
const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
app.use(metricsMiddleware);

// Serve React frontend
app.use(express.static(path.join(process.cwd(), "frontend/build"))); // Adjust if build folder is different

// Fallback route for frontend (React SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
