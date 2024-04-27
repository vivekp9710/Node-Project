
// import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./router/user";
import cors from "cors";
import postRouter from "./router/post";
import likeRouter from "./router/like";

const app = express();


app.use(express.json());
// app.use(bodyParser.urlencoded({extended:false}));

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);

app.use(cors({
    origin: "http://localhost:5173/",
    Credential: true,
}));


app.use(cookieParser());

app.get("/", (_, res) => {
    res.send("hello world...!")

});

export default app;