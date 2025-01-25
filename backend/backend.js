import express from "express";
import cors from "cors";
import { sequelize } from "./sqliteCreate.js";
import { Users, OrderHistory, UserOpinions, ProductData } from "./sqliteInitialize.js";
import {
  getInitialUsers,
  getInitialOrders,
  getInitialOpinions,
  getInitalProductData
} from "./sqliteInitialize.js";
import userService from "./userService.js";
import orderService from "./orderService.js";
import opinionService from "./opinionService.js";
import productService from "./productService.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Redirect HTTP requests to service files
app.use("/users", userService);
app.use("/orders", orderService);
app.use("/opinions", opinionService);
app.use("/productdata", productService);

async function initServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection with DB has been established");

    // delete previoues entries from DB
    await sequelize.sync({ force: true });
    console.log("Tables created");

    // fill DB with mock data
    Users.bulkCreate(getInitialUsers());
    OrderHistory.bulkCreate(getInitialOrders());
    UserOpinions.bulkCreate(getInitialOpinions());
    ProductData.bulkCreate(getInitalProductData());

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log("Could not start server, ", err);
  }
}

initServer();
