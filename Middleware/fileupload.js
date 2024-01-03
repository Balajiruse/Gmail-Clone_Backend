import multer from "multer";
import { handleUpload } from "../service/helper.js";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
      files: 5, // Allowing up to 5 files to be uploaded
    }});
const myUploadMiddleware = upload.single("sample_file");

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

 const handler = async (req, res) => {
    try {
      await runMiddleware(req, res, myUploadMiddleware);
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      res.json(cldRes);
    } catch (error) {
      console.log(error,"from the handler");  
        res.status(500).json({message: error.message});
    }
  };
  export default handler;
  export const config = {
    api: {
      bodyParser: false,
    },
  };