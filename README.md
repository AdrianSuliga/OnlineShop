# Prestissimo Online Shop

Online Shop project - final project for _Introduction to Web Applications_ AGH UST course.

## Table of Contents
- [Installation](#Installation)
- [Key features](#Key-Features)
- [Technologies used](#Technologies-Used)
- [Authors](#Authors)

## Installation
There are two steps needed to setup this project. First, you need to clone it and install necessary dependencies.
```
git clone git@github.com:AdrianSuliga/OnlineShop.git
cd OnlineShop
npm install
cd backend
npm install
```
Than, you can run frontend of the app.
```
cd OnlineShop
npm run dev
```
As well as back-end.
```
cd OnlineShop/backend
node backend.js
```
Application assumes backend is running on port ```3000```, so make sure it is not occupied by different tasks.

## Key Features
<div style="text-align: justify">
Prestissimo is an online shop that uses <a href="https://fakestoreapi.com/">fake store API</a> as its source 
of data.
</div>

As a non-logged-in user you can:

- browse shop offer

- read product details

- add and remove items from your cart

- read other user's reviews

As a logged-in user you can additionally:

- make a purchase

- browse you purchase history

- add opinions about products

## Technologies Used

- React

- TypeScript 

- Ant Design 

- Node JS 

- Express 

- SQLite 

## Authors

- [Adrian Suliga](https://github.com/AdrianSuliga)
 
- [Dominik Matuszczyk](https://github.com/DominikMat)

- [Filip Wolski](https://github.com/filip9315)