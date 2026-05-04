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
      isSpecial: (code) => code?.startsWith("FWC"),
      isFirst: (code) => /[A-Z]+1$/.test(code),
      formatDate: (date) => {
        const d = new Date(date);
        const day = d.getUTCDate();
        const month = d.getUTCMonth() + 1;
        const year = d.getUTCFullYear();
        return `${day}/${month}/${year}`;
      },
      pricePerPack: (amount, quantity) => {
        if (!amount || !quantity) return "-";
        const value = amount / quantity;
        return (
          "$" +
          value.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
      },
      formatAmount: (amount) => {
        if (!amount) return "-";
        return "$" + Number(amount).toLocaleString("es-AR");
      },
      isoDate: (date) => new Date(date).toISOString().split("T")[0],
    },
  }),
);

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", stickersRouter);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
