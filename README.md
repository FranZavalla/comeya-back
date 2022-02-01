# ComeYa - Backend
A simple food ordering app

## Introduction
ComeYa is a project that I set out to do during the month of January 2022. The goal was to learn and develop the application with NodeJS and React, and then publish it on my curriculum.
ComeYa is a food ordering application, from a user to a store or restaurant. It is inspired by [PedidosYa](https://www.pedidosya.com.ar/)
This is the backend, to see the frontend [click here](https://github.com/FranZavalla/comeya-front/)

### Table of contents
- [Install](#install)
- [Run](#run)
- [Database tables](#database-tables)
- [Routes protocol](#routes-protocol)
  * [Users](#users)
    + [/signup](#signup)
    + [/login](#login)
    + [/profile/:token](#profiletoken)
    + [/update_profile](#update_profile)
  * [Stores](#stores)
    + [/signup_store](#signup_store)
    + [/login_store](#login_store)
    + [/profile_store/:token](#profile_storetoken)
    + [/update_store_profile](#update_store_profile)
    + [/get_store/:type](#get_storetype)
    + [/top_stores](#top_stores)
    + [/store_vote/:id](#store_voteid)    
  * [Auth](#auth)
    + [/auth_user/:token](#auth_usertoken)
    + [/auth_store/:token](#auth_storetoken)
  * [Products](#products)
    + [/new_product](#new_product)
    + [/edit_product](#edit_product)
    + [/del_product](#del_product)
    + [/get_products/:store_name](#get_productsstore_name)
  * [Orders](#orders)
    + [/new_order](#new_order)
    + [/get_orders/:store_name](#get_ordersstore_name)
    + [/cancel_order](#cancel_order)
    + [/accept_order](#accept_order)
- [ToDo](#todo)

# Install

- ```npm install```

# Run

**Note**: you need NodeJS to run the backend

- ```npm start```

# Database tables
- **Users**: ```{ id, username, password, name, address, image, color }```
- **Stores**: ```{ id, store_name, password, address, phone_number, image, store_type, rating, color }```
- **Products**: ```{ id, product_name, description, price, image, StoreId }```
- **Orders**: ```{ id, username, address, store_name, total_price, delivered }```
- **OrderProducts**: ```{ id, product_name, description, price, quantity, OrderId, ProductId }```
- **Stars**: ```{ id, vote, UserId, StoreId }```

# Routes protocol

## Users

### /signup
* Method POST
* Create a new user
* **Receives**: ```username, password, name``` as JSON 
* **Returns**:
  - On successful registration -> code 201, ```{ auth: true, token }```
  - If username already exist -> code 201, ```{ auth: false, status: "Your username already exist" }```
  - If the username is too short -> code 200, ```{ auth: false, status: "Username must be 5 chars at least" }```
  - If any data is missing -> code 200, ```{ auth: false, status: "Username, password and name are required" }```
  - On server error -> code 500, ```{ status: "There was a problem registering your user" }```
  
* The given token will be used in future calls to the backend

### /login
* Method POST
* Check if the user is registered and grants permission to the site
* **Receives**: ```username, password``` as JSON 
* **Returns**:
  - On successful log in -> code 201, ```{ auth: true, token }```
  - If the password or username is incorrect -> code 200, ```{ auth: false, status: "Incorrect username or password" }```
  - If any data is missing -> code 200, ```{ auth: false, status: "Username, password and name are required" }```
  - On server error -> code 500, ```{ status: "There was a problem logging" }```
  
* The given token will be used in future calls to the backend

### /profile/:token
* Method GET
* Returns the user information corresponding to the token
* **Receives**: token as parameter in url
* **Returns**:
  - If the user was found correctly -> code 200, ```{ auth: true, user: { username, name, image, color } }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the user was not found correctly -> code 404, ```{ status: "User not found" }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
* The given token will be used in future calls to the backend

### /update_profile
* Method PUT
* Update a user's data
* **Receives**: token in ```x-access-token``` header and ```name, image, addres``` as JSON
* **Returns**:
  - If the data was updated correctly -> code 200, ```{ auth: true, user: { name, address, image, color }, status: "Profile updated!" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the user was not found correctly -> code 404, ```{ status: "User not found" }```
  - On server error -> code 500, ```{ status: "There was a problem updating" }```


## Stores

### /signup_store
* Method POST
* Create a new store
* **Receives**: ```store_name, password, address, phone_number, image, store_type``` as JSON 
* **Returns**:
  - On successful registration -> code 201, ```{ auth: true, token }```
  - If store_name already exist -> code 201, ```{ auth: false, status: "Your store name already exist" }```
  - If any data is missing -> code 200, ```{ auth: false, status: "Store name, password, phone and type are required" }```
  - On server error -> code 500, ```{ status: "There was a problem registering your store" }```
  
* The given token will be used in future calls to the backend

### /login_store
* Method POST
* Check if the store is registered and grants permission to the site
* **Receives**: ```store_name, password``` as JSON 
* **Returns**:
  - On successful log in -> code 201, ```{ auth: true, token }```
  - If the password or store_name is incorrect -> code 200, ```{ auth: false, status: "Incorrect store name or password" }```
  - If any data is missing -> code 200, ```{ auth: false, status: "Missing store name or username" }```
  - On server error -> code 500, ```{ status: "There was a problem logging" }```
  
* The given token will be used in future calls to the backend

### /profile_store/:token
* Method GET
* Returns the store information corresponding to the token
* **Receives**: token as parameter in url
* **Returns**:
  - If the user was found correctly -> code 200, ```{ auth: true, store: { store_name, address, phone_number, image, color } }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
* The given token will be used in future calls to the backend

### /update_store_profile
* Method PUT
* Update a store's data
* **Receives**: token in ```x-access-token``` header and ```address, phone_number, image, store_type``` as JSON
* **Returns**:
  - If the data was updated correctly -> code 200, ```{ auth: true, store: { store_name, address, phone_number, image, color }, status: "Information updated!" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - On server error -> code 500, ```{ status: "There was a problem updating" }```
  
### /get_store/:type
* Method GET
* Get a list of 10 stores sorted alphabetically
* **Receives**: type as parameter in url
* **Returns**:
  - If the information was obtained correctly -> code 200, ```{ stores }```
  - if the type does not exist  -> code 403, ```{ status: "Failed type of store" }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
* 'stores' is a list of store

### /top_stores
* Method GET
* Get a list of top 7 stores
* **Receives**: nothing
* **Returns**:
  - If the information was obtained correctly -> code 200, ```{ status: "OK", stores }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
### /store_vote/:id
* Method POST
* Give a vote to a store
* **Receives**: token in ```x-access-token``` header, id (store) as parameter in url and ```rating``` as JSON
* **Returns**:
  - If the vote was given correctly -> code 200, ```{ status: "Vote saved", rating }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the id is missing -> code 403, ```{ status: "No store ID provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If the user was not found correctly -> code 404, ```{ status: "User not found" }```
  - If the value in vote is incorrect -> code 403, ```{ status: "Incorrect value in rating" }```  
  - On server error -> code 500, ```{ status: "There was a problem voting" }```
  
## Auth

### /auth_user/:token
* Method GET
* Check if the user token is authorized to enter the site
* **Receives**: token as parameter in url
* **Returns**:
  - If the user exist and token is correct -> code 200, ```{ auth: true }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the user was not found correctly -> code 404, ```{ status: "User not found" }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
* The given token will be used in future calls to the backend
  
### /auth_store/:token
* Method GET
* Check if the store token is authorized to enter the site
* **Receives**: token as parameter in url
* **Returns**:
  - If the store exist and token is correct -> code 200, ```{ auth: true }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
* The given token will be used in future calls to the backend

## Products
  
### /new_product
* Method POST
* Create a new product in the store referred by the token
* **Receives**: token in ```x-access-token``` header and ```{ product_name, description, price, image }``` as JSON
* **Returns**:
  - If the product was created correctly -> code 200, ```{ added: true, status: "Product added" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If any data is missing -> code 200, ```{ added: false, status: "Product name and price are required" }```
  - If price is less than 0 -> code 200, ```{ added: false, status: "Price must be higher than 0" }```
  - If description is too long -> code 200, ```{ added: false, status: "The description must be less than 32 characters" }```
  - On server error -> code 500, ```{ status: "There was a problem adding a new product" }```
  
### /edit_product
* Method PUT
* Edit a product in the store referred by the token
* **Receives**: token in ```x-access-token``` header and ```{ id, product_name, description, price, imagee }``` as JSON
* **Returns**:
  - If the product was edited correctly -> code 200, ```{ edited: true, status: "Product edited!" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If the product was not found correctly -> code 404, ```{ status: "Product not found" }```
  - If price is less than 0 -> code 200, ```{ added: false, status: "Price must be higher than 0" }```
  - If description is too long -> code 200, ```{ added: false, status: "The description must be less than 32 characters" }```
  - On server error -> code 500, ```{ status: "There was a problem updating" }```
  
### /del_product
* Method PUT
* Delete a product in the store referred by the token
* **Receives**: token in ```x-access-token``` header and ```{ id }``` as JSON
* **Returns**:
  - If the product was deleted correctly -> code 200, ```{ status: "Product deleted!" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If the product was not found correctly -> code 404, ```{ status: "Product not found" }```
  - On server error -> code 500, ```{ status: "There was a problem deleting" }```
  
### /get_products/:store_name
* Method GET
* Get all products in a store
* **Receives**: store_name as parameter in url
* **Returns**:
  - If the product was deleted correctly -> code 200, ```{ products }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - On server error -> code 500, ```{ status: "There was a problem getting information" }```
  
* 'products' is a list of product


## Orders

### /new_order
* Method POST
* Create a new order from the token user
* **Receives**: token in ```x-access-token``` header and ```{ storeId, total_price, products }``` as JSON
* **Returns**:
  - If the order was created correctly -> code 201, ```{ completed: true, status: "Order completed" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If the user was not found correctly -> code 404, ```{ status: "User not found" }```
  - If any data is missing -> code 500, ```{ status: "Store ID, price and products are required" }```
  - If total_price is less than 0 -> code 500, ```{ status: "Price cannot be zero or negative" }```
  - If any product was not found correctly -> code 404, ```{ status: "Product not found" }```
  - On a server error when adding a product -> code 500, ```{ status: "There was a problem with one of your products" }```
  - On server error -> code 500, ```{ status: "There was a problem in your order" }```
  
### /get_orders/:store_name
* Method GET
* Get all orders in a store referred by the token
* **Receives**: token in ```x-access-token``` header and store_name as parameter in url
* **Returns**:
  - If the order was created correctly -> code 200, ```{ orders }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store_name is missing -> code 403, ```{ status: "No store name provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - On server error -> code 500, ```{ status: "There was a problem getting orders" }```

* 'orders' is a list of order
  
### /cancel_order
* Method POST
* Cancel a order in a store referred by the token
* **Receives**: token in ```x-access-token``` header and ```{ orderId }``` as JSON
* **Returns**:
  - If the order was canceled correctly -> code 200, ```{ status: "Order removed successfully" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If the order was not found correctly -> code 404, ```{ status: "Order not found" }```
  - On server error -> code 500, ```{ status: "There was a problem removing the order" }```
  
### /accept_order
* Method POST
* Accept a order in a store referred by the token
* **Receives**: token in ```x-access-token``` header and ```{ orderId }``` as JSON
* **Returns**:
  - If the order was canceled correctly -> code 200, ```{ status: "Order delivered!" }```
  - If the token is missing -> code 403, ```{ status: "No token provided" }```
  - If the store was not found correctly -> code 404, ```{ status: "Store not found" }```
  - If the order was not found correctly -> code 404, ```{ status: "Order not found" }```
  - On server error -> code 500, ```{ status: "There was a problem accepting the order" }```
  
# ToDo
### The following features were not implemented due to lack of time/knowledge. The project was thought to be developed in a month

- Change localStorage in frontend to cookies sent from backend
- Implement images to users, stores and products
- Delete products in cart
- Change the username/store_name to an email and use it as a primary key in the database
- Add an automatic update of new orders for stores
- Add a notice message to users when their order is accepted/cancelled
  
