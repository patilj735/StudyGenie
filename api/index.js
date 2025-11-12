import express from "express"
import connectDB from "../config/db.js";
import authRoutes from "../routes/user.routes.js"
import fileRoutes from "../routes/file.routes.js"
import aiRoutes from "../routes/ai.routes.js"

const app=express();
const PORT=8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))

connectDB();

app.get("/",(req,res)=>{
    res.send("StudyGenie website is running!");
});

app.use("/api/auth",authRoutes);
app.use("/api/data",fileRoutes);
app.use("/api/ai",aiRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`);
});

