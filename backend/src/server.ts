import "dotenv/config";

import express, { Request, Response } from "express";
import { QrCodeGenerateService } from "./generate-qrcode.service";
import cors from "cors";

const app = express();

app.use(express.json());

const qrCodeGenerateService = new QrCodeGenerateService();

app.use(
  cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello Typescript",
  });
});

app.post("/qrcode", async (req: Request, res: Response) => {
  const { text } = req.body;
  const image = await qrCodeGenerateService.generate(text);
  res.send({ image });
});

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
