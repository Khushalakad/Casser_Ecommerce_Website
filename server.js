import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/Db.js';
import authRoutes from './routes/authroute.js'
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import cors from 'cors'
dotenv.config();
//connect database config
connectDB();

//rest object
const app=express();
//Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
//auth route
app.use('/api/v1/auth',authRoutes)
//category route
app.use('/api/v1/category',categoryRoute)
//product route
app.use('/api/v1/product',productRoute)

app.get('/',(req,res)=>{
  res.send({
    message:'wellcome to the app'
  })
})



app.listen(process.env.PORT,(req,res)=>{
    console.log(`server is listening at ${process.env.PORT}`.bgCyan.white);
})
