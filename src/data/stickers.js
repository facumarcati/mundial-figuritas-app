export const teamOrder = [
  // Grupo 1
  "MEX",
  "RSA",
  "KOR",
  "CZE",

  // Grupo 2
  "CAN",
  "BIH",
  "QAT",
  "SUI",

  // Grupo 3
  "BRA",
  "MAR",
  "HAI",
  "SCO",

  // Grupo 4
  "USA",
  "PAR",
  "AUS",
  "TUR",

  // Grupo 5
  "GER",
  "CUW",
  "CIV",
  "ECU",

  // Grupo 6
  "NED",
  "JPN",
  "SWE",
  "TUN",

  // Grupo 7
  "BEL",
  "EGY",
  "IRN",
  "NZL",

  // Grupo 8
  "ESP",
  "CPV",
  "KSA",
  "URU",

  // Grupo 9
  "FRA",
  "SEN",
  "IRQ",
  "NOR",

  // Grupo 10
  "ARG",
  "ALG",
  "AUT",
  "JOR",

  // Grupo 11
  "POR",
  "COD",
  "UZB",
  "COL",

  // Grupo 12
  "ENG",
  "CRO",
  "GHA",
  "PAN",
];

// especiales primero
const specialStickers = [
  ...Array.from({ length: 20 }, (_, i) => `FWC${String(i).padStart(2, "0")}`),
];

// equipos ordenados por grupo
const teamStickers = teamOrder.flatMap((team) =>
  Array.from({ length: 20 }, (_, i) => `${team}${i + 1}`),
);

// resultado final
const stickers = [...specialStickers, ...teamStickers];

export default stickers;
