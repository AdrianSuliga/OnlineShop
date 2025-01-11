import express from "express";
import { OrderHistory } from "./sqliteInitialize.js";

const router = express.Router();
export default router;

router.post("/add", async (req, res) => {
  let allOrders = await OrderHistory.findAll();
  let newOrderID = -1;
  allOrders.forEach((order) => {
    newOrderID = Math.max(newOrderID, order.OrderID);
  });
  newOrderID++;

  req.body.ProductsBought.forEach((productDetails) => {
    const mockDate = new Date();
    const newOrder = OrderHistory.create({
      OrderID: newOrderID,
      UserID: req.body.UserID,
      ProductID: productDetails.ProductID,
      Quantity: productDetails.Quantity,
      OrderDate: mockDate.toISOString(),
    });

    if (newOrder === null) {
      res.status(500).send({ info: "Failed to add new orders" });
      return;
    }
  });

  res.status(200).send({ info: "Added new orders" });
});

router.get("/details/:userID", async (req, res) => {
  const orders = await OrderHistory.findAll({
    where: {
      UserID: req.params.userID,
    },
  });

  if (orders === null) {
    res.status(200).send({
      Orders: [],
    });
    return;
  }

  const groupedOrders = orders.reduce((acc, order) => {
    const { OrderID, ProductID, Quantity, OrderDate } = order;
    if (!acc[OrderID]) {
      acc[OrderID] = { OrderID, OrderDate, ProductsBought: [] };
    }
    acc[OrderID].ProductsBought.push({
      productID: ProductID,
      quantity: Quantity,
    });
    return acc;
  }, {});

  const OrdersToSend = Object.values(groupedOrders);
  res.status(200).send({ Orders: OrdersToSend });
});

router.get("/details/:userID/:orderID", async (req, res) => {
  const orders = await OrderHistory.findAll({
    where: {
      UserID: req.params.userID,
      OrderID: req.params.orderID,
    },
  });

  if (orders === null) {
    res.status(404).send({ info: "Order not found" });
    return;
  }

  let result = { OrderDate: orders[0].OrderDate, ProductsBought: [] };
  orders.forEach((order) => {
    result.ProductsBought.push({
      ProductID: order.ProductID,
      Quantity: order.Quantity,
    });
  });

  res.status(200).send(result);
});
