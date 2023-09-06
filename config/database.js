const mongoose = require('mongoose')
require('dotenv').config()
const dbConnection =()=>
{
    mongoose
.connect(process.env.DB_URI)
.then((conn)=>
{console.log(`Database connection established at ${conn.connection.host}` )})
}

module.exports =dbConnection
