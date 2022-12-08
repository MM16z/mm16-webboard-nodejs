const db = require("../db");

const router = express.Router();
var jwt = require("jsonwebtoken");
const mm16ztoken = "mm16z-login-token-1616";
const mm16zrefreshtoken = "mm16z-login-refresh-token-1616";

router.post("/refreshjwtauth", jsonParser, (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwtToken) return res.sendStatus(401);
  console.log(cookies);
  const refreshToken = cookies.jwtToken;
  db.query(
    "SELECT * FROM `mm16-webboard`.`users` WHERE email=?",
    [req.cookies.jwtToken],
    (err, email, field) => {
      if (err) return res.json({ errMessage: err.message });
      if (email[0].refresh_token !== refreshToken) return res.sendStatus(403);
      jwt.verify(cookies.jwtToken, mm16zrefreshtoken, (err, decoded) => {
        if (err) return res.json({ errMessage: err });
        if (email !== decoded.email) return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            email: email[0].email,
            username: email[0].username,
            userId: email[0].user_id,
          },
          mm16ztoken,
          {
            expiresIn: "900s",
          }
        );
        res.json({ status: "ok", accessToken });
      });
    }
  );
});

module.exports = router;
