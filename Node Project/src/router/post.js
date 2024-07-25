import express from "express";
import { create, remove, getAll, getByUser } from "../controller/post";
import { auth } from "../middleware/auth"
import multer from "multer";
import fs from "fs-extra";
import { imageUpload } from "../middleware/imageUpload";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "/public/"
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, "profile" + "." + `${file.originalname.split(".").pop()}`)
    }
})

const router = new express.Router();
const upload = multer({ storage });

router.get("./get-all", getAll);

router.get("getByUser", auth, getByUser);

router.post("/create", auth, create);

router.delete("/delete/:id", auth, remove);

router.post("/uploads", upload.single("profile"), async (req, res) => {
    console.log("---->", req.file);
    let url = await imageUpload(req.file.url);
    res.status(200).send({ data: url, success: true, message: "" });
});



export default router;