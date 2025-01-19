import express from "express";
import { OrderHistory } from "./sqliteInitialize.js";
import cors from "cors";

const router = express.Router();
export default router;

router.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Add new orders to DB
// URL: http://localhost:port/orders/add
// this function expects request body to have
// {
//    UserID: ...,
//    ProductsBought: [
//        ProductID: ...,
//        Quantity: ...
//    ]
// }
// it allows us to add a lot of products in one order
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

// Get all orders a user made
// URL: http://localhost:port/orders/details/:userID
// no request body is needed
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

// Get specific order user made
// URL: http://localhost:port/orders/details/:userID/:orderID
// no request body is needed
router.get("/details/:userID/:orderID", async (req, res) => {
  const orders = await OrderHistory.findAll({
    where: {
      UserID: req.params.userID,
      OrderID: req.params.orderID,
    },
  });

  if (orders.length === 0) {
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
