import Sticker from "../models/sticker.model.js";
import stickers from "../data/stickers.js";

const seedStickers = async () => {
  try {
    await Sticker.deleteMany({});

    const stickersToInsert = stickers.map((code) => ({
      code,
    }));

    await Sticker.insertMany(stickersToInsert);

    console.log(`${stickersToInsert.length} figuritas cargadas`);
  } catch (error) {
    console.error(error.message);
  }
};

export default seedStickers;
