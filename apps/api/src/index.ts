import express, {Request, Response} from 'express';
// import dotenv from 'dotenv';
const app = express();
app.use(express.json());
// dotenv.config();

// const port:string = '3001';
const port:number = 3001;

app.get(`/`, (req: Request, res: Response) => {
    res.json({message: "Hello from Meta Server!"});
})



app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})