import express from "express";
import { ProductData } from "./sqliteInitialize.js";

const router = express.Router();
export default router;

// Get produt stock levels
// URL: http://localhost:port/productdata/:productID
router.get("/:productID", async (req, res) => {
  const data = await ProductData.findOne({
    where: {
      ProductID: req.params.productID,
    },
  });

  if (data === null) {
    res.status(404).send({info: "Product not found"});
  } else {
    res.status(200).send(data);
  }
});

// Update product discount
// URL: http://localhost:port/productdata/:productID
router.patch("/:productID", async (req, res) => {
  try {
    const { discount } = req.body;

    if (discount == null || isNaN(discount)) {
      return res.status(400).send({ error: "Invalid discount value" });
    }

    const product = await ProductData.findOne({
      where: {
        ProductID: req.params.productID,
      },
    });

    if (product === null) {
      res.status(404).send({ info: "Product not found" });
    } else {
      // Update the discount value
      await ProductData.update(
        { Discount: discount }, // Field to update
        { where: { ProductID: req.params.productID } } // Condition
      );
      res.status(200).send({ info: "Discount updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while updating the discount" });
  }
});