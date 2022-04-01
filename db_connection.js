const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/LeaveManagement', {
    useNewUrlParser: true,
    useUnifiedTopology:true
 
},()=>{
    console.log("db connected");
})

// MODEL CREATION
const Employee=mongoose.model("Employee",{

    username:String,
    date_of_birth:Date,
    age:Number,
    email:String,
    emp_id:Number,
    password:String,
    category:String,
    designation:String,
    mobile_number:Number,
    department:String,
    deleted:{
        type:Boolean,
        default:false
    }
    // department_id:{
    //     type:mongoose.Types.ObjectId,
    //     ref:Department
    // }
})


 const User = mongoose.model("User", {
    
    username: String,
    password: String,
    emp_id:Number,
    category: String,
    deleted:{
        type:Boolean,
        default:false
    }
    
})

const Department=mongoose.model("Department",{
    department_name:String,
    department_id:Number
})

const Leave=mongoose.model("Leave",{
    emp_id:Number,
    from_date:String,
    to_date:String,
    days:Number,
    reason:String,
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:"pending"
    }
})

module.exports = {
    User,
    Employee,
    Department,
    Leave
}