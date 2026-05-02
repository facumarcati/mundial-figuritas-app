import { Router } from "express";
import {
  getHome,
  toggleStickerStatus,
  addPack,
} from "../controllers/stickers.controller.js";

const router = Router();

router.get("/", getHome);
router.patch("/:id", toggleStickerStatus);
router.post("/packs", addPack);

export default router;
