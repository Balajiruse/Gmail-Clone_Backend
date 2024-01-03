import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataBaseConnection } from "./db.js";
import { emailRouter } from "./Routes/email.js";
import { userRouter } from "./Routes/user.js";
import { isAuthorized } from "./Middleware/authenticate.js";

//configure env variables
dotenv.config();

//server setup
const app = express();
const PORT = process.env.PORT;

//database connection
dataBaseConnection();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api", userRouter);
app.use("/api",isAuthorized, emailRouter);

//listen the server
app.listen(PORT, ()=>{
    console.log(`Server started in localhost:${PORT}`);
})