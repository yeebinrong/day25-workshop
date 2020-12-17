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
app.use(morgan('common'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// #### RESOURCES #### 

// ### DELETE REQUESTS ###
// ## DELETE /API/TODO/ID ##
app.delete('/api/todo/:id', async (req, resp) => {
    const id = req.params.id
    try {
        await QUERY_DELETE_TODO_WITH_ID(id)
        await QUERY_DELETE_ALL_TASKS_WITH_ID(id)
        resp.status(200)
        resp.type('application/json')
        resp.json({})
    } catch (e) {
        console.error("Error deleting: ", e)
        resp.status(404)
        resp.type('application/json')
        resp.json({})
    }
})

// ### POST REQUESTS ###
// ## POST /API/UPLOAD ##
app.post('/api/upload', upload.none('data'), async (req, resp) => {
    const data = JSON.parse(req.body.data)
    console.info("POSTING", data)
    if (data.id != null) {
        await SQL_DELETE_REMOVED_TASKS(data);
    }
    await SQL_UPSERT(data);
    resp.status(200)
    resp.type('application/json')
    resp.json({})
})

// ### GET REQUESTS ###
// ## GET /API/TODO/?ID ##
app.get('/api/todo/:id', async (req, resp) => {
    const id = req.params.id
    if (id === 'all') {
        try {
            const result = await QUERY_SELECT_ALL_TODO()
            resp.status(200)
            resp.type('application/json')
            resp.json(result)
        } catch (e) {
            console.info("Error getting all todos : ", e)
        }
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
        if (!results.name) {
            resp.status(404)
            resp.type('application/json')
            resp.json({error:"Not found."})
        } else {
            resp.status(200)
            resp.type('application/json')
            resp.json(results)
        }
    }
})



// #### FUNCTIONS ####
SQL_UPSERT = async (data) => {
    try {
        const id = (await QUERY_INSERT_TODO_RETURN_ID([data['id'],data['name'], data['due']])).insertId || data.id
        upsertTask = data.tasks.map(task => {
            return [task.task_id, id, task.description, task.priority]
        }) 
        if (upsertTask.length > 0) {
            console.info(await QUERY_UPSERT_TASK_BY_TASK_ID([upsertTask]))
        }
    } catch (e) {
        console.info("UPDATE ERROR: ", e)
    }

}

SQL_DELETE_REMOVED_TASKS = async (data) => {
    const id = data.id
    let currentData = (await QUERY_SELECT_FROM_VIEW(id)).map(d => {
        return {
            id: d.id,
            task_id: d.task_id,
            description: d.description,
            priority: d.priority,
            name: d.name,
            due: d.due
        }
    })
    const toDelete = currentData.filter((task) =>
        data.tasks.every(include => 
            task.task_id != include.task_id)
        ).map (d => {
            return d.task_id
        }
    )
    if (toDelete.length > 0) {
        await QUERY_DELETE_TASK_BY_TASK_ID([toDelete])
    }
}

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

// SQL STATEMENTS
const UPSERT_TODO_RETURN_ID = 'INSERT INTO todo (id, name, due) VALUES (?,?,?) AS data ON DUPLICATE KEY UPDATE name=data.name, due=data.due'
const UPSERT_TASKS_BY_TASK_ID = 'INSERT INTO tasks (task_id, id, description, priority) VALUES ? AS data ON DUPLICATE KEY UPDATE description=data.description, priority=data.priority'

const SELECT_ALL_TODO = 'SELECT * FROM todo'
const SELECT_TODO_WITH_ID = 'SELECT * FROM todo WHERE id = ?'
const SELECT_TASKS_WITH_ID = 'SELECT * FROM tasks WHERE id = ?'
const SELECT_VIEW_UPDATE = 'SELECT * FROM `UPDATE` WHERE id = ?';

const DELETE_TASKS_BY_TASK_ID = 'DELETE FROM tasks WHERE task_id IN (?)'
const DELETE_TODO_WITH_ID = 'DELETE FROM todo WHERE id = ?';
const DELETE_ALL_TASK_WITH_ID = 'DELETE FROM tasks WHERE id = ?';

// SQL QUERIES
const QUERY_INSERT_TODO_RETURN_ID = makeQuery(UPSERT_TODO_RETURN_ID, POOL)
const QUERY_UPSERT_TASK_BY_TASK_ID = makeQuery(UPSERT_TASKS_BY_TASK_ID, POOL)

const QUERY_SELECT_ALL_TODO = makeQuery(SELECT_ALL_TODO, POOL)
const QUERY_SELECT_TODO_WITH_ID = makeQuery(SELECT_TODO_WITH_ID, POOL) 
const QUERY_SELECT_TASKS_WITH_ID = makeQuery(SELECT_TASKS_WITH_ID, POOL)
const QUERY_SELECT_FROM_VIEW = makeQuery(SELECT_VIEW_UPDATE, POOL)

const QUERY_DELETE_TODO_WITH_ID = makeQuery(DELETE_TODO_WITH_ID, POOL)
const QUERY_DELETE_ALL_TASKS_WITH_ID = makeQuery(DELETE_ALL_TASK_WITH_ID, POOL)
const QUERY_DELETE_TASK_BY_TASK_ID = makeQuery(DELETE_TASKS_BY_TASK_ID, POOL)
 
// Test connection of database
POOL.getConnection()
    .then (conn => {
        conn.ping()
        console.info('Pinging for database...')
        return conn
    })
    .then (conn => {
        conn.release()
        console.info('Pinging successful...')
        // Start the application
        app.listen(PORT, () => {
            console.info(`Application is listening PORT ${PORT} at ${new Date()}.`)
        })
    })