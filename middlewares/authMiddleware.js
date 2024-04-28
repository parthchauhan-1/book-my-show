const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.headers;
    // console.log(token);
    const decoded = jwt.verify(token, process.env.secret_key_jwt);
    // console.log(decoded);
    req.body.userId = decoded.userID;
    next();
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, message: "Invalid token!!!", err });
  }
};
