const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/LeaveManagement', {
    useNewUrlParser: true,
    useUnifiedTopology:true
 
},()=>{
    console.log("db connected");
})


const Employee=mongoose.model("Employee",{
username:String,
// date:Date,
age:Number,
email:String,
emp_id:Number,
password:String,
category:String

})

// MODEL CREATION
 const User = mongoose.model("User", {
    
    username: String,
    password: String,
    emp_id:Number,
    category: String
    
})

module.exports = {
    User,
    Employee
}