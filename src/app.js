import express from "express";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import connectMongoDB from "./config/db.js";

import seedStickers from "./utils/seedStickers.js";
import stickersRouter from "./routes/stickers.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

await connectMongoDB();
await seedStickers();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a?.toString() === b?.toString(),
      statusClass: (status) => {
        const classes = {
          missing: "missing",
          owned: "owned",
          duplicate: "duplicate",
        };

        return classes[status] || "missing";
      },
      statusText: (status) => {
        const texts = {
          missing: "Faltante",
          owned: "Conseguida",
          duplicate: "Repetida",
        };
        return texts[status] || "Faltante";
      },
      endsWith: (text, suffix) => {
        return text?.endsWith(suffix);
      },
      isSpecial: (code) => {
        return code?.endsWith("0") || code?.startsWith("FWC");
      },
    },
  }),
);

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", stickersRouter);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
