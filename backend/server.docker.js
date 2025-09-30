import app from "./app.docker.js";
import cloudinary from "cloudinary";
import promBundle from "express-prom-bundle";

const metricsMiddleware = promBundle({
    includeMethod: true, // Track HTTP methods
    includePath: true, // Track request paths
    includeStatusCode: true, // Track response codes
    metricsPath: "/metrics", // Prometheus will scrape here
    promClient: {
	collectDefaultMetrics: {}, // CPU, memory, event loop lag, etc.
    },
});

app.use(metricsMiddleware);


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at port ${PORT}`);
  console.log(`Prometheus metrics available at http://localhost:${PORT}/metrics`);
});
