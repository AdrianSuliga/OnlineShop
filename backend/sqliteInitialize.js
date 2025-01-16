import { DataTypes, DATE, Sequelize } from "sequelize";
import { sequelize } from "./sqliteCreate.js";

// Create SQLite tables
export const Users = sequelize.define(
  "Users",
  {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AdminRights: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export const OrderHistory = sequelize.define(
  "OrderHistory",
  {
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OrderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export const UserOpinions = sequelize.define(
  "UserOpinions",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OpinionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export const ProductStockLevels = sequelize.define(
  "ProductStockLevels",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    StockLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export function getInitialUsers() {
  return [
    {
      UserName: "Mateusz Jarosz",
      Email: "mateusz.jarosz@gmail.com",
      Password: "adminPassword",
      AdminRights: true,
    },
    {
      UserName: "Arian Suliga",
      Email: "adrian.suliga@gmail.com",
      Password: "normalPassword",
      AdminRights: false,
    },
    {
      UserName: "Dominik Matuszczyk",
      Email: "dominikmat@gmail.com",
      Password: "passwd",
      AdminRights: false,
    },
    {
      UserName: "Filip Wolski",
      Email: "filip.wolski@gmail.com",
      Password: "sthsthwdai",
      AdminRights: false,
    },
  ];
}

export function getInitialOrders() {
  return [
    {
      OrderID: 0,
      ProductID: 1,
      UserID: 1,
      Quantity: 2,
      OrderDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      OrderID: 0,
      ProductID: 4,
      UserID: 1,
      Quantity: 1,
      OrderDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      OrderID: 1,
      ProductID: 7,
      UserID: 2,
      Quantity: 3,
      OrderDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      OrderID: 2,
      ProductID: 3,
      UserID: 1,
      Quantity: 1,
      OrderDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  ];
}

export function getInitialOpinions() {
  return [
    {
      UserID: 1,
      ProductID: 1,
      Rating: 5,
      Content: "This is awesome! Highly recommend",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 2,
      ProductID: 3,
      Rating: 1,
      Content: "It was delivered to me damaged :((",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 1,
      ProductID: 5,
      Rating: 4,
      Content: "Decent product for the price.",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 3,
      ProductID: 7,
      Rating: 5,
      Content: "Exceeded my expectations, great quality!",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 4,
      ProductID: 10,
      Rating: 3,
      Content: "Not worth the money. Poor quality.",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 2,
      ProductID: 8,
      Rating: 5,
      Content: "Fast delivery and works perfectly.",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 1,
      ProductID: 15,
      Rating: 2,
      Content: "The product description was misleading.",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 3,
      ProductID: 20,
      Rating: 5,
      Content: "Stylish and functional. Love it!",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 4,
      ProductID: 12,
      Rating: 3,
      Content: "I had issues initially, but customer support was helpful.",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 2,
      ProductID: 18,
      Rating: 5,
      Content: "Great value for the price. Highly recommended.",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    {
      UserID: 1,
      ProductID: 18,
      Rating: 4,
      Content: "Actually, pretty good",
      OpinionDate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  ];
}

export function getInitalStockLevels() {
  return [
    { ProductID: 1, StockLevel: 100 },
    { ProductID: 2, StockLevel: 100 },
    { ProductID: 3, StockLevel: 100 },
    { ProductID: 4, StockLevel: 100 },
    { ProductID: 5, StockLevel: 100 },

    { ProductID: 6, StockLevel: 100 },
    { ProductID: 7, StockLevel: 100 },
    { ProductID: 8, StockLevel: 100 },
    { ProductID: 9, StockLevel: 100 },
    { ProductID: 10, StockLevel: 100 },

    { ProductID: 11, StockLevel: 100 },
    { ProductID: 12, StockLevel: 100 },
    { ProductID: 13, StockLevel: 100 },
    { ProductID: 14, StockLevel: 100 },
    { ProductID: 15, StockLevel: 100 },

    { ProductID: 16, StockLevel: 100 },
    { ProductID: 17, StockLevel: 100 },
    { ProductID: 18, StockLevel: 100 },
    { ProductID: 19, StockLevel: 100 },
    { ProductID: 20, StockLevel: 100 },
  ];
}
