import express, {Request, Response} from 'express';
import { sendOTP, generateOTP, storeOTP } from './worker';
import Redis from "ioredis";
import dotenv from 'dotenv';
const app = express();
app.use(express.json());
dotenv.config();

const port:number = 3001;
const redis = new Redis(process.env.REDIS_URL as string);

app.get(`/`, (req: Request, res: Response) => {
    res.json({message: "Hello from Meta Server!"});
})

app.post(`/send-otp`, async(req: Request, res: Response) => {
    const {email} = req.body;
    const otp = generateOTP();
    storeOTP(email, otp);
    sendOTP(email, otp);
    res.json({message: "OTP sent successfully!"});
})

app.post(`/verify-otp`, async(req:Request, res:Response) => {
    const {email, otp} = req.body;
    const storedOTP = await redis.get(`otp:${email}`);
    if(storedOTP === otp){
        res.json({message: "OTP verified successfully!"});
    }else{
        res.status(400).json({message: "Invalid OTP!"});
    }
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})