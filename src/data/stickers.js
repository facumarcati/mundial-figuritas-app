export const teamOrder = [
  // Grupo 1
  "MEX",
  "KOR",
  "RSA",
  "CZE",

  // Grupo 2
  "CAN",
  "SUI",
  "QAT",
  "BIH",

  // Grupo 3
  "BRA",
  "MAR",
  "SCO",
  "HAI",

  // Grupo 4
  "USA",
  "AUS",
  "PAR",
  "TUR",

  // Grupo 5
  "GER",
  "ECU",
  "CIV",
  "CUW",

  // Grupo 6
  "NED",
  "JPN",
  "TUN",
  "SWE",

  // Grupo 7
  "BEL",
  "IRN",
  "EGY",
  "NZL",

  // Grupo 8
  "CPV",
  "KSA",
  "ESP",
  "URU",

  // Grupo 9
  "FRA",
  "SEN",
  "NOR",
  "IRQ",

  // Grupo 10
  "ARG",
  "ALG",
  "AUT",
  "JOR",

  // Grupo 11
  "POR",
  "COL",
  "UZB",
  "COD",

  // Grupo 12
  "ENG",
  "CRO",
  "PAN",
  "GHA",
];

// especiales primero
const specialStickers = [
  ...Array.from({ length: 10 }, (_, i) => `FWC${String(i).padStart(2, "0")}`),
];

// equipos ordenados por grupo
const teamStickers = teamOrder.flatMap((team) =>
  Array.from({ length: 20 }, (_, i) => `${team}${i + 1}`),
);

// resultado final
const stickers = [...specialStickers, ...teamStickers];

export default stickers;
