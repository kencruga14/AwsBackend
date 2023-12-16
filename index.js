import express from "express";
import fileUpload from "express-fileupload";
import {
  uploadFile,
  getFiles,
  downloadFile,
  getFileURL,
} from "./s3.js";
import cors from 'cors';
import mime from 'mime';

const corsOptions = {
  origins: ["http://localhost:4200", "https://example.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  headers: ["Content-Type", "Authorization"],
};

const app = express();
app.use(cors(corsOptions));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/archivos", async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
});

app.get("/archivos/:fileName", async (req, res) => {
  const extension = fileName.split(".").pop();
  console.log("filename: " + fileName);
  const result = await getFileURL(req.params.fileName);
  res.json({
    url: result,
    extension: extension,
  });
});

app.get("/descargarArchivo/:fileName", async (req, res) => {
    const filename = req.params.fileName;
    const response = await downloadFile(filename);
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': mime.getType(filename)
    });
    response.pipe(res); // Canaliza el stream del archivo a la respuesta
  });

app.post("/archivo", async (req, res) => {
  const result = await uploadFile(req.files.file);
  res.json({ result });
});

app.use(express.static("images"));

app.listen(3000);
console.log(`Server on port ${3000}`);
