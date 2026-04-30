import { Router } from "express";
import {
  getHome,
  toggleStickerStatus,
} from "../controllers/stickers.controller.js";

const router = Router();

router.get("/", getHome);
router.patch("/:id", toggleStickerStatus);

export default router;
