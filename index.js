const express=require('express')
const app =express()
const cors = require('cors')
const db = require('./db_connection')
app.use(express.json())



app.use(cors({
    origin: 'http://localhost:3001'
}))

//admin functions
app.post("/login",(req,res)=>{
    const{username,password}=req.body
    db.User.findOne({username:username}).then(user => {
        if (user) {
            if (password == user.password) {

                res.json({
                    Status: 200,
                    message: "login successfull",
                    
                })

            } else {
                // res.status(402).send({ message: "incorrect password" })
                res.json({
                    Status: 404,
                    message: "incorrect password",
                 })
            }

        } else {
            res.send({ message: "user does not exist" })
        }
    })
})


app.post("/adduser",(req,res)=>{
    const{username, age,email,emp_id,password,category}=req.body
    db.Employee.findOne({emp_id}).then(user=>{
        if(user){
            res.send({ message: "already exist" })
        }else{
            const user = new db.Employee({
                username,
                // date,
                age,
                email,
                emp_id,
                password,
                category
                
            })
            const emp=new db.User({
                username,
                emp_id,
                password,
                category
            })
           
            user.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"added successfully"})
                }
            })
            emp.save()
        }
    })
}) 
 
app.post("/viewall",(req,res)=>{
    db.Employee.find().then(user=>{
        res.send(user)
    })
})



app.listen(4000,()=>{
    console.log("server is up and runs at 4000");
})