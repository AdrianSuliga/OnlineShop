import express from "express";
import { sequelize } from "./sqliteCreate.js";
import { Users, OrderHistory, UserOpinions } from "./sqliteInitialize.js";
import {
  getInitialUsers,
  getInitialOrders,
  getInitialOpinions,
} from "./sqliteInitialize.js";
import userService from "./userService.js";
import orderService from "./orderService.js";
import opinionService from "./opinionService.js";

const app = express();
const port = 3000;

app.use(express.json());

// Redirect HTTP requests to service files
app.use("/users", userService);
app.use("/orders", orderService);
app.use("/opinions", opinionService);

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

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log("Could not start server, ", err);
  }
}

initServer();
