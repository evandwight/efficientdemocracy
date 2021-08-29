require("dotenv").config();
const { Pool } = require("pg");

function getConfig() {
    const config = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD || "",
        port: process.env.DB_PORT,
        ssl: false,
    };
    if (process.env.NODE_ENV === "test") {
        return {... config, database:"test_red"};
    } else {
        return config;
    }
}

export function getPool() {
    // console.log("config", getConfig());
    return new Pool(getConfig());
}
