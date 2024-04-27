import express from "express";
import { LikeDislike } from "../controller/like";
import { auth } from "../middleware/auth"

const router = express.Router();

// router.get("./get-all", getAll);

// router.get("getByUser", auth, getByUser);

router.post("/like-dislike", auth, LikeDislike);

// router.delete("/delete/:id", auth, remove);




export default router;