require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { auth } = require("express-openid-connect");

const jwtAuth = require("./middleware/jwtauth");
const refreshJwtAuth = require("./middleware/refreshjwtauth");
const registerRouter = require("./router/register");
const loginRouter = require("./router/login");
const logoutRouter = require("./router/logout");
const userServiceRouter = require("./router/user-service");
const userPostDataRouter = require("./router/user-post-data");

const PORT = process.env.APPPORT ?? process.env.PORT;

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0KEY,
  baseURL: "https://mm16z-webboard-nextjs-fullstack.vercel.app",
  clientID: "Hl0bruG8s7tpZTdmSDZi1TQPUO26Ac4x",
  issuerBaseURL: "https://dev-xfh5b1jpuyqqdrb6.jp.auth0.com",
};

app.use(auth(config));

app.get("/", (req, res) => {
  res.json({ ServerStatus: "Running..." });
  console.log(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.use("/", jwtAuth);
app.use("/", refreshJwtAuth);
app.use("/", userPostDataRouter);
app.use("/", registerRouter);
// app.use("/", loginRouter);
app.use("/", userServiceRouter);
app.use("/", logoutRouter);

app.listen(PORT, () => {
  console.log(`runing on http://localhost:${PORT}`);
});
