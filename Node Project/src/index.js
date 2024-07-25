import "dotenv/config";
import app from "./app";
import { config } from "./config";
import { dbConnect } from "./db/db";

const port = config.port || 8000

dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);

    });

}).catch((err) => {
    console.log("something went wrong")
});

