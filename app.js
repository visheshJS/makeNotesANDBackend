import dotenv from 'dotenv'
dotenv.config({
    path: "./.env"
})

import cookieParser from 'cookie-parser'
import { userRouter } from './routes/user.routes.js'
import cors from 'cors'
import express, { response } from 'express'
import connectDB from './db/connection.js'
import { verifyJWT } from './middlewares/auth.middleware.js'
import { logOutUser,registerUser,loginUser } from './controllers/user.controller.js'
const app = express();

app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const port= process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', './views'); // Set the views directory for EJS files

//SERVE STATIC FILES FROM FRONTEND/DIST FOLDER

app.use("/xyz/:user",express.static('./frontend/dist'));

// Routes
app.get("/", verifyJWT ,(req, res) => {
    if (!req.user) {
        res.redirect("/login");
      } else {
        console.log("verfied token");
        res.redirect(`/xyz/${req.user.name}`);
    }
});
app.get("/home" ,(req, res) => {
    res.render('home'); // Renders home.ejs
});
app.get("/xyz/:user", verifyJWT ,(req, res) => {
    res.send("hehe");
});


app.get("/signup", (req, res) => {
    res.render('signup'); // Renders signup.ejs
});

app.get("/login",(req, res) => {
    res.render('login'); // Renders login.ejs
});

app.post("/logout",verifyJWT ,logOutUser,(req, res) => {
    res.redirect('/home')
})
app.post("/signup" , registerUser);
app.post("/login",  loginUser);
// app.post("/signup",(req,res)=>{
//     res.redirect("/xyz")
// })

// app.get("/signup",(req, res) => {
//     res.redirect('/xyz')
// })

//NOTES APP (static html from frontend/dist folder)


// User Routes
// app.use('/api/users', userRouter);
 // Use user routes for authentication

// Catch-all route for undefined endpoints
// app.use((req, res) => {
//     res.status(404).json({ message: 'Route not found' });
// });

app.get("*", (req, res) => {
    res.redirect("/login");
  });

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR:",error);
        throw error;
    })
    
    app.listen(port, ()=>{
        console.log(`Server is running at http://localhost:${port}`); // Print localhost URL
        
    });
})
.catch((err)=>{
    console.log("mongo db connection is failed bro !!",err);

})

