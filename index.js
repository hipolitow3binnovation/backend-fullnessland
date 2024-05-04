const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { google } = require("googleapis");
const app = express();
app.use(cors());
app.use(
  cors({
    // origin: 'https://regal-fox-8e6181.netlify.app'
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/write-to-sheet", async (req, res) => {

  console.log(req.body.data)
  const auth = new google.auth.GoogleAuth({
    keyFile: "./googlesheet_fullnessland.json", // Ruta al archivo JSON de credenciales
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1V-vWMOTIB08Qp34irQY5LKW-RdKgV8rPcyt2zqu4gBk"; // El ID de tu hoja de Google Sheets

  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "A2",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: req.body.data, // Usa 'data' directamente desde el cuerpo de la petición
      },
    });
    res.send({ message: "Datos agregados correctamente" });
  } catch (error) {
    console.error("Error al escribir en la hoja de cálculo", error);
    res
      .status(500)
      .send({ message: "Error al escribir en la hoja de cálculo" });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
