import express from 'express'
import cors from 'cors'
import cookie_parser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use(express.urlencoded({extended:true})) // for parsing application with url like somewhere it is dev+patel other place it is dev%20patel...
app.use(express.static("public"))  // to serve static files like images,css files,javascript files
app.use(cookie_parser())

//routes
import user_router from './routes/user.js' 
app.use("/" , user_router)

export {app}