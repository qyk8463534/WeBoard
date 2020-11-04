const jwtSetting = require("../config");
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../modelsMongoDB/user");

const jwtSecret = jwtSetting.jwtSecret;
const jwtAccessTime = jwtSetting.jwtAccessTime;
const router = express.Router();

/*
 * user sign in
 */
router.post("/user/accessToken", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await UserModel.findOne({
      email: email,
    }).lean();

    if (userDoc === null) {
      throw { status: 401, message: "user does not exist" };
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      userDoc.password || ""
    );
    if (passwordsMatch === false) {
      throw { status: 401, message: "password did not match" };
    }

    if (userDoc.accessToken && userDoc.accessToken !== "") {
      const decode = jwt.decode(userDoc.accessToken, { complete: true });
      if (decode.payload.exp * 1000 - Date.now() > 5 * 60000) {
        res
          .status(200)
          .send({ _id: userDoc._id, accessToken: userDoc.accessToken });
        return;
      }
    }

    jwt.sign(
      {
        //email: email,
        id: userDoc._id,
      },
      jwtSecret,
      jwtAccessTime,
      (error, accessToken) => {
        if (error) {
          res.sendStatus(500);
        } else {
          UserModel.updateOne(
            { _id: userDoc._id },
            { accessToken: accessToken },
            (err) => {
              if (err) {
                res.sendStatus(500);
              } else {
                res
                  .status(200)
                  .send({ _id: userDoc._id, accessToken: accessToken });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(error.status ? error.status : 500).send(error.message);
  }
});

/*
 * user sign up
 */

router.post("/user", async (req, res) => {
  const { email, password } = req.body;
  const hashCost = 6;
  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const userDoc = new UserModel({ email: email, password: passwordHash });
    await userDoc.save();

    jwt.sign(
      {
        //email: email,
        id: userDoc._id,
      },
      jwtSecret,
      jwtAccessTime,
      (error, accessToken) => {
        if (error) {
          res.sendStatus(200);
        } else {
          UserModel.updateOne(
            { _id: userDoc._id },
            { accessToken: accessToken },
            (err) => {
              if (err) {
                res.sendStatus(200);
              } else {
                res
                  .status(200)
                  .send({ _id: userDoc._id, accessToken: accessToken });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(error.status ? error.status : 500).send(error.message);
  }
});
/*
 * TO DO:signout
 */


/*
 * release jwt
 */
router.put(
  "/user/self/accessToken",
  //passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.body;
    jwt.sign(
      {
        //email: email,
        id: id,
      },
      jwtSecret,
      jwtAccessTime,
      (error, accessToken) => {
        if (error) {
          res.sendStatus(500);
        } else {
          UserModel.updateOne(
            { _id: id },
            { accessToken: accessToken },
            (err) => {
              if (err) {
                res.sendStatus(500);
              } else {
                res.status(200).send({ accessToken });
              }
            }
          );
        }
      }
    );
  }
);

/*
 * JWT lifespan
 */
router.get(
  "/user/me/accessToken",
  //passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.sendStatus(200);
  }
);

module.exports = router;
