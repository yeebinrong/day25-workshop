// load libraries
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mysql = require('mysql2/promise')
const secure = require('secure-env')
const multer = require('multer')
const fs = require('fs')
const bodyParser = require('body-parser')

// create an instance of express and multer
const app = express()
const upload = multer({dest: `${__dirname}/uploads/`})

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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// SQL STATEMENTS
const INSERT_TODO_RETURN_ID = 'INSERT INTO todo (name, due) VALUES (?,?)'
const INSERT_TASKS = 'INSERT INTO tasks (id, description, priority) VALUES ?'
const SELECT_LAST_INSERT_ID = 'SELECT LAST_INSERT_ID() as id'
const SELECT_ALL_TODO = 'SELECT * FROM todo'
const SELECT_TODO_WITH_ID = 'SELECT * FROM todo WHERE id = ?'
const SELECT_TASKS_WITH_ID = 'SELECT * FROM tasks WHERE id = ?'

// Make SQL Query
makeQuery = (STMT, POOL) => {
    return async (PARAMS) => {
        const conn = await POOL.getConnection()
        try {
            const results = await conn.query(STMT, PARAMS)
            return results[0]
        } catch (e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
}

// SQL QUERIES
const QUERY_INSERT_TODO_RETURN_ID = makeQuery(INSERT_TODO_RETURN_ID, POOL)
const QUERY_INSERT_TASKS = makeQuery(INSERT_TASKS, POOL)
const QUERY_SELECT_LAST_INSERT_ID = makeQuery(SELECT_LAST_INSERT_ID, POOL)
const QUERY_SELECT_ALL_TODO = makeQuery(SELECT_ALL_TODO, POOL)
const QUERY_SELECT_TODO_WITH_ID = makeQuery(SELECT_TODO_WITH_ID, POOL) 
const QUERY_SELECT_TASKS_WITH_ID = makeQuery(SELECT_TASKS_WITH_ID, POOL)

// #### RESOURCES #### 

// ### POST REQUESTS ###
// ## POST /API/UPLOAD ##
app.post('/api/upload', upload.none('data'), async (req, resp) => {
    const data = JSON.parse(req.body.data)
    await QUERY_INSERT_TODO_RETURN_ID([data['name'], data['due']])
    const id = (await QUERY_SELECT_LAST_INSERT_ID())[0].id;
    const taskArray = data.tasks.map(task => {
        return [id, task.description, task.priority]
    })
    if (data.tasks.length > 0) {
        await QUERY_INSERT_TASKS([taskArray])
    }
    resp.status(200)
    resp.type('application/json')
    resp.json({})
})

// ### GET REQUESTS ###
// ## GET /API/TODO ##
app.get('/api/todo/:id', async (req, resp) => {
    const id = req.params.id
    if (id == 'all') {
        const result = await QUERY_SELECT_ALL_TODO()
        resp.status(200)
        resp.type('application/json')
        resp.json(result)
    } else {
        const results = Object.assign({},(await QUERY_SELECT_TODO_WITH_ID(id))[0])
        const tasks = (await QUERY_SELECT_TASKS_WITH_ID(id)).map(d => {
            return {
                task_id: d.task_id,
                id: d.id,
                description: d.description,
                priority: d.priority
            }
        })
        results.tasks = tasks;
        resp.status(200)
        resp.type('application/json')
        resp.json(results)
    }
})

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