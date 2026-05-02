import { teamOrder } from "../data/stickers.js";

import Sticker from "../models/sticker.model.js";

export const getAllStickers = async (req, res) => {
  try {
    const stickers = await Sticker.find().sort({ code: 1 }).lean();

    res.render("home", {
      title: "Figuritas Mundial 2026",
      stickers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const toggleStickerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const sticker = await Sticker.findById(id);

    if (!sticker) {
      return res.status(404).json({
        success: false,
        message: "Figurita no encontrada",
      });
    }

    const statusOrder = {
      missing: "owned",
      owned: "duplicate",
      duplicate: "missing",
    };

    const newStatus = statusOrder[sticker.status];

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido",
      });
    }

    sticker.status = newStatus;
    await sticker.save();

    res.json({
      success: true,
      status: sticker.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const getHome = async (req, res) => {
  try {
    const stickers = await Sticker.find().lean();

    const orderMap = new Map(
      teamOrder.flatMap((team, teamIndex) =>
        Array.from({ length: 20 }, (_, i) => [
          `${team}${i + 1}`,
          teamIndex * 20 + i,
        ]),
      ),
    );

    const isSpecial = (code) =>
      code.startsWith("FWC") || code.startsWith("STA");

    stickers.sort((a, b) => {
      const aSpecial = isSpecial(a.code);
      const bSpecial = isSpecial(b.code);

      // 1. especiales primero
      if (aSpecial && !bSpecial) return -1;
      if (!aSpecial && bSpecial) return 1;

      // 2. entre especiales (orden simple)
      if (aSpecial && bSpecial) {
        return a.code.localeCompare(b.code);
      }

      // 3. equipos (orden mundial)
      const aIndex = orderMap.get(a.code) ?? 999999;
      const bIndex = orderMap.get(b.code) ?? 999999;

      return aIndex - bIndex;
    });

    const groupedStickers = stickers.reduce((groups, sticker) => {
      const prefix = sticker.code.match(/^[A-Z]+/)[0];

      if (!groups[prefix]) {
        groups[prefix] = {
          name: sectionNames[prefix] || prefix,
          stickers: [],
        };
      }

      groups[prefix].stickers.push(sticker);
      return groups;
    }, {});

    const ownedCount = stickers.filter(
      (sticker) => sticker.status === "owned",
    ).length;

    const dupCount = stickers.filter(
      (sticker) => sticker.status === "duplicate",
    ).length;

    const missingCount = stickers.filter((s) => s.status === "missing").length;

    const completedCount = stickers.filter(
      (s) => s.status === "owned" || s.status === "duplicate",
    ).length;

    const completion = Math.round((completedCount / stickers.length) * 100);

    res.render("home", {
      title: "Álbum Mundial 2026",
      groupedStickers,
      totalCount: stickers.length,
      ownedCount,
      dupCount,
      missingCount,
      completion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el álbum");
  }
};

const sectionNames = {
  FWC: "Especiales 🏆",

  // CONCACAF
  USA: "Estados Unidos",
  MEX: "México",
  CAN: "Canadá",
  PAN: "Panamá",
  HAI: "Haití",
  CUW: "Curazao",

  // CONMEBOL
  ARG: "Argentina",
  BRA: "Brasil",
  URU: "Uruguay",
  COL: "Colombia",
  ECU: "Ecuador",
  PAR: "Paraguay",

  // UEFA
  ENG: "Inglaterra",
  FRA: "Francia",
  ESP: "España",
  GER: "Alemania",
  NED: "Países Bajos",
  POR: "Portugal",
  BEL: "Bélgica",
  CRO: "Croacia",
  SUI: "Suiza",
  AUT: "Austria",
  NOR: "Noruega",
  SCO: "Escocia",
  SWE: "Suecia",
  TUR: "Turquía",
  BIH: "Bosnia y Herzegovina",
  CZE: "Republica Checa",

  // CAF
  MAR: "Marruecos",
  SEN: "Senegal",
  EGY: "Egipto",
  ALG: "Argelia",
  GHA: "Ghana",
  CIV: "Costa de Marfil",
  TUN: "Túnez",
  RSA: "Sudáfrica",
  CPV: "Cabo Verde",
  COD: "República Democrática del Congo",

  // AFC
  JPN: "Japón",
  KOR: "Corea del Sur",
  IRN: "Irán",
  AUS: "Australia",
  KSA: "Arabia Saudita",
  QAT: "Qatar",
  UZB: "Uzbekistán",
  JOR: "Jordania",
  IRQ: "Irak",

  // OFC
  NZL: "Nueva Zelanda",
};
