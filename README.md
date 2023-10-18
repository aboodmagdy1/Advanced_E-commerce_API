<h1 align="center">
  <br>
  <a href="https://lakshman-natours.herokuapp.com/"><img src="https://github.com/aboodmagdy1/E-Shop/blob/main/Public/imgs/E-Shop%20Icon.jpg" alt="Natours" width="200"></a>
  <br>
  Advanced_E-commerce_API

  <br>
</h1>

<h4 align="center">An awesome E-Shop API built on top of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

## Key Features 📝

* Authentication and Authorization
  - Sign up, Log in, Update,forget Password and reset password.
* User profile
  - Update username, photo, email, password, and other information
  - A user can be either a regular user or an admin or a manager
    
* Products
  - Product can be created , updated and deleted by an admin or manager.
  - Product can be seen by every user.
    
* Categories
  - Category can be created , updated and deleted by an admin or manager.
  - Category  can be seen by every user.
    
* Subcategories
  - subcategory can be created ,updated and deleted by an admin or manager.
  - subcategory can be seen by every user.
    
* Brands
  - brand can be created ,updated and deleted by an admin or manager.
  - subcategory can be seen by every user.
    
* Reviews
  - review can be created ,updated  by user.
  - review can be deleted by user , admin and manager.
    
* Orders
  - Only regular users can make  Order 
  - User can pay cash or card with stripe
  - Regular users can see all the orders they have pay for .
  - An admin and manager have the ability to Update order info like isPaid , paidAt ,isDeliverd , deliverdAt
* Cart
  - Only regular users have cart
  - User can update and delete specific product in cart like quantity
  - User can applay a coupon on specific product
  - User can clear all product from cart
* Coupon
  - Only admin or manager can create ,get ,update ,delete Coupons
  - User just use the coupon
  - 
* Adresses 
  - A regular user can have multiple adresses 
  - A regular user can create ,update and delete adress  
    

* Wishlist
  - A regular user can have a wishlit to save his favorites
  - A regular user can add any product to favorites 
  - A regular user can remove a product from their list of favorite product.


### Buy a Product
* Login to the site
* Search for product that you want to buy
* buy a tour
* Proceed to the payment checkout page
* Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: any futer date
  - CVV: any 3 numbers
  ```
* Finished!


### Update your profile

* You can update your own username, profile photo, email, and password.


## Build With 🏗️

* [NodeJS](https://nodejs.org/en/) - JS runtime environment
* [Express](http://expressjs.com/) - The web framework used
* [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
* [JSON Web Token](https://jwt.io/) - Security token
* [Stripe](https://stripe.com/) - Online payment API and Making payments on the app.
* [Postman](https://www.getpostman.com/) - API testing
* [Mailtrap](https://mailtrap.io/) & [Gmail](https://gmail.com/) - Email delivery platform




## Setting Up Your Local Environment ⚙️
![demo-env-file](https://github.com/aboodmagdy1/E-Shop/blob/main/Public/imgs/envSetting.png)


## Installation 🛠️
You can fork the app or you can git-clone the app into your local machine. Once done, please install all the
dependencies by running
```
$ npm i
Set your env variables
$ npm run start:dev (for development)
$ npm run start:prod (for production)

