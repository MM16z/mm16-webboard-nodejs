require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const registerRouter = require("./router/register");
const loginRouter = require("./router/login");
const jwtAuth = require("./router/jwtauth");
const userServiceRouter = require("./router/user-service");
const userPostDataRouter = require("./router/user-post-data");

const PORT = process.env.APPPORT ?? process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ServerStatus: "Running..." });
});

app.use("/", jwtAuth);
app.use("/", registerRouter);
app.use("/", loginRouter);
app.use("/", userServiceRouter);
app.use("/", userPostDataRouter);
// app.use("/", userPostLikedRouter);

app.listen(PORT, () => {
  console.log(`runing on http://localhost:${PORT}`);
});
