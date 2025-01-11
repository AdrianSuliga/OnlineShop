import express from "express";
import { UserOpinions, Users } from "./sqliteInitialize.js";

const router = express.Router();
export default router;

// Add one new opinion about the product
// URL: http://localhost:port/opinions/add/:productID
// this function expects request body to have:
// {
//    UserID: ...,
//    Content: ...
// }
// productID is passed in URL
router.post("/add/:productID", async (req, res) => {
  const userCheck = await UserOpinions.findOne({
    where: {
      UserID: req.body.UserID,
      ProductID: req.params.productID,
    },
  });

  if (userCheck !== null) {
    res.status(401).send({
      info: "You have already given opinion about this product, remove it to add new one",
    });
    return;
  }

  const mockDate = new Date();
  const newOpinion = await UserOpinions.create({
    ProductID: req.params.productID,
    UserID: req.body.UserID,
    Content: req.body.Content,
    OpinionDate: mockDate.toISOString(),
  });

  if (newOpinion === null) {
    res.status(500).send({ info: "Failed to add new opinion" });
    return;
  }

  res.status(200).send({ info: "Opinion added" });
});

// Delete opinions, if user is an admin, they can delete everything
// URL: http://localhost:port/opinions/delete/:opinionID
// this function expects request body to have:
// {
//    UserID: ...
// }
// opinionID is passed in URL
router.delete("/delete/:opinionID", async (req, res) => {
  const opinionToDelete = await UserOpinions.findOne({
    where: {
      OpinionID: req.params.opinionID,
    },
  });

  const userData = await Users.findOne({
    where: {
      UserID: req.body.UserID,
    },
  });

  if (opinionToDelete === null) {
    res.status(404).send({ info: "Opinion not found" });
    return;
  }

  if (userData === null) {
    res.status(404).send({ info: "User not found" });
    return;
  }

  if (userData.AdminRights || opinionToDelete.UserID === req.body.UserID) {
    const deletedEntries = await UserOpinions.destroy({
      where: {
        OpinionID: req.params.opinionID,
      },
    });

    if (deletedEntries > 0) {
      res.status(200).send({ info: "Opinion deleted" });
    } else {
      res.status(500).send({ info: "Could not remove this opinion" });
    }
    return;
  }

  res.status(401).send({ info: "You cannot delete this opinion" });
});

// Get all opinions about the product
// URL: http://localhost:port/opinions/:productID
// no request body is needed
router.get("/:productID", async (req, res) => {
  const opinions = await UserOpinions.findAll({
    where: {
      ProductID: req.params.productID,
    },
  });

  if (opinions === null) {
    opinions = [];
  }

  res.status(200).send(opinions);
});
