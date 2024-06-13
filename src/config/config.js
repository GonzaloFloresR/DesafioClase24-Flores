const dotenv = require("dotenv");

dotenv.config(
    {
        path:"./src/.env",
        override:true
    }
);

const config = { 
        PORT: process.env.PORT||8080,
        MONGO_URL: process.env.MONGO_URL,
        DB_NAME: process.env.DB_NAME,
        SECRET: process.env.SECRET
}

module.exports = config;