import express from "express";
import dotenv from 'dotenv';
import router from './routes/routes';
import { connectToDB } from "./db/dt";
var cors = require('cors');
const PORT = process.env.PORT || 3000;
import ErrorHandler from "./error/ErrorHandler";
// import { HttpException } from "./error/HttpExceptions";

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((_req: Request, _res: Response, next: NextFunction) => next(new HttpException(404, "Route not found")));
//@ts-ignore
app.use(ErrorHandler);

app.use('/v1', router);
app.use('/v2', router); // IF ANY MAJOR CHANGES AFTER PROD

const initializeApp = async () => {
    try {
        app.listen(PORT, () => console.log(`[server]: server is running at http://localhost:${PORT}`));
       await connectToDB();
    } catch (err) {
        console.error(err);
        process.exit(1);
    } 
}

initializeApp();