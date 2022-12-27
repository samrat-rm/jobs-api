require("dotenv").config();
require("express-async-errors"); // async wrapper (try & catch)
const express = require("express");
const app = express();
const jobRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const connectDB = require("./db/connect");
const authenticationMiddleware = require("./middleware/authentication");
const helmate = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Security Middlewares
app.set("trust proxy", 1);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(helmate());

// extra packages

// routes
app.get("/", (req, res) => {
    res.send("Jobs API ( ° ͜ʖ ͡°) ");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticationMiddleware, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_CONNECT).then(() => {
            console.log("Connected to DB...");
        });
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
