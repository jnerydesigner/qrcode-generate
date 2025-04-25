import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const _dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.SERVER_PORT | 8075;

app.use(express.static(path.join(_dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(_dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server Running in PORT ${PORT}`);
});
