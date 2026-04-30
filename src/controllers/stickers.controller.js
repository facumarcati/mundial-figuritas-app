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

    stickers.sort((a, b) => {
      const parse = (code) => {
        const match = code.match(/^([A-Z]+)(\d+)$/);
        return {
          prefix: match[1],
          number: parseInt(match[2], 10),
        };
      };

      const A = parse(a.code);
      const B = parse(b.code);

      if (A.prefix !== B.prefix) {
        return A.prefix.localeCompare(B.prefix);
      }

      return A.number - B.number;
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

    const isSpecial = (code) => {
      return code?.endsWith("0") || code?.startsWith("FWC");
    };

    const specialStickers = stickers.filter((s) => isSpecial(s.code));

    const specialOwned = specialStickers.filter(
      (s) => s.status === "owned",
    ).length;

    const specialTotal = specialStickers.length;

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
      specialOwned,
      specialTotal,
      completion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el álbum");
  }
};

const sectionNames = {
  FWC: "Especiales 🏆",
  STA: "Estadios 🏟️",
  MEX: "México",
  ARG: "Argentina",
  BRA: "Brasil",
  URU: "Uruguay",
  COL: "Colombia",
};
