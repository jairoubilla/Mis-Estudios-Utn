import pg from "pg";
import{PG_PORT,PG_HOST,PG_USER,PG_PASSWORD,PG_DATABASE} from "./config.js"


export const pool = new pg.Pool({
    port: 5432,
    host: 'Localhost',
    user: 'postgres',
    password: 'admin123',
    database: 'PERN',
});

pool.on("connect", () => {
    console.log("connectado a la base de datos");
});