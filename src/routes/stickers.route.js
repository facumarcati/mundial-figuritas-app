import { Router } from "express";
import {
  getHome,
  toggleStickerStatus,
  addPack,
  updatePack,
  deletePack,
} from "../controllers/stickers.controller.js";

const router = Router();

router.get("/", getHome);
router.patch("/:id", toggleStickerStatus);

router.post("/packs", addPack);
router.post("/packs/:id/update", updatePack);
router.post("/packs/:id/delete", deletePack);

export default router;
