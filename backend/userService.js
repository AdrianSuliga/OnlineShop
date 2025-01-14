import express from "express";
import { Users } from "./sqliteInitialize.js";
import cors from "cors";
import { generateToken } from "./generateJWT.js";

const router = express.Router();
export default router;

router.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Register new user
// URL: http://localhost:port/users/register
// this function expects request body to have:
// {
//    userName: ...,
//    email: ...,
//    password: ...,
//    adminRights: ...
// }
router.post("/register", async (req, res) => {
  const userMailCheck = await Users.findOne({
    where: {
      Email: req.body.email,
    },
  });

  if (userMailCheck !== null) {
    res
      .status(401)
      .send({ info: "User with this e-mail is already registered!" });
    return;
  }

  const userNameCheck = await Users.findOne({
    where: {
      UserName: req.body.userName,
    },
  });

  if (userNameCheck !== null) {
    res
      .status(401)
      .send({ info: "User with this name is already registered!" });
    return;
  }

  const newUser = await Users.create({
    UserName: req.body.userName,
    Email: req.body.email,
    Password: req.body.password,
    AdminRights: req.body.adminRights,
  });

  if (newUser === null) {
    res.status(500).send({ info: "Failed to register new user" });
  } else {
    const token = generateToken(newUser.id);
    res.status(200).json({ toke: token, userID: newUser.UserID });
  }
});

// Login user
// URL: http://localhost:port/users/login
// this function expects request body to have:
// {
//    email: ...,
//    password: ...
// }
router.post("/login", async (req, res) => {
  const userCheck = await Users.findOne({
    where: {
      Email: req.body.email,
    },
  });

  if (userCheck === null) {
    res.status(404).send({ info: "This user does not exist" });
    return;
  }

  if (userCheck.Password === req.body.password) {
    const token = generateToken(userCheck.id);
    res.status(200).json({ toke: token, userID: userCheck.UserID });
  } else {
    res.status(401).send({ info: "Wrong password" });
  }
});
