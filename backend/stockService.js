import express from "express";
import { ProductStockLevels } from "./sqliteInitialize.js";

const router = express.Router();
export default router;


// Get produt stock levels
// URL: http://localhost:port/stocklevel/:productID
router.get("/:productID", async (req, res) => {
  const lvls = await ProductStockLevels.findOne({
    where: {
      ProductID: req.params.productID,
    },
  });

  if (lvls === null) {
    lvls = [];
  }

  res.status(200).send(lvls);
});
