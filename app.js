
require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimitter = require('express-rate-limit');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');

const app = express();

const authRouter = require('./routes/auth');
const authentication = require('./middleware/authentication');
const jobsRouter = require('./routes/jobs');

const errorHandlerMiddleware = require('./middleware/error-handler');

const notFoundMiddleware = require('./middleware/not-found');
const connectDB = require('./db/connect');
app.set('trust proxy',1);
app.use(rateLimitter({
   windowMs: 15*60 *1000,
   max : 100,
}));

app.use(express.json());

app.use(helmet());
app.use(cors());
app.use(xss());


app.get('/',(req,res)=>{
   res.send('<h1>JOBS API </h1><a href="/api-docs">Documentation</a>');
})

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument));


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authentication,jobsRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000 ;

const start = async ()=>{
   try{
      await connectDB(process.env.MONGO_URI);
      app.listen(port, console.log(`server is listenting on ${port}`))
   }catch(error){
   console.log(error);
   }
}

start();
