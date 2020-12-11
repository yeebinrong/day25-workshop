// load libraries
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mysql = require('mysql2/promise')
const secure = require('secure-env')

// create an instance of express
const app = express()

// load variables
global.env = secure({secret: process.env.ENV_PASSWORD})
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const POOL = mysql.createPool({
    host: global.env.SQL_HOST,
    port: global.env.SQL_PORT,
    user: global.env.SQL_USER,
    password: global.env.SQL_PASS,
    database: global.env.SQL_SCHEMA,
    connectionLimit: global.env.SQL_CON_LIMIT
})

// use cors header
app.use(cors())

// log requests using morgan
app.use(morgan('combined'))

POOL.getConnection()
    .then (conn => {
        conn.ping()
        console.info('Pinging for database...')
        return conn
    })
    .then (conn => {
        conn.release()
        console.info('Pinging successful...')
        app.listen(PORT, () => {
            console.info(`Application is listening PORT ${PORT} at ${new Date()}.`)
        })
    })