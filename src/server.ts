import app from "./app";
import connectDB from "./config/db";

const PORT = process?.env?.["PORT"] || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Failed to connect to the database:", err);
  });
