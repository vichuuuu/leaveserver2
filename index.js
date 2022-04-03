const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db_connection')
app.use(express.json())
const jwt = require('jsonwebtoken')



app.use(cors({
    origin: 'http://localhost:3000'
}))


const jwtmiddleware = (req, res, next) => {
    try {

        const token = req.headers["x-access-token"]
        //token=token.split(" ")[1]
        const data = jwt.verify(token, 'secretkey123')
        next()
    }
    catch (err) {
        console.log(err);
        res.json({
            statusCode: 401,
            status: false,
            message: " You are not AUTHORIZED...Token validation failed........please login"
        })
    }

}

//admin functions
app.post("/login", (req, res) => {
    const { username, password } = req.body
    db.User.findOne({ username: username }).then(user => {
        console.log(user);
        if (user) {
            if (user.deleted == true) {
             res.send({ message: "user blocked" })
            } else {

                if (password == user.password) {
                    const token = jwt.sign({
                        currentUser: username
                    }, 'secretkey123')
                    console.log(token);

                    res.json({
                        Status: 200,
                        message: "login successfull",
                        token

                    })
                    // res.send(user)

                } else {

                    res.json({
                        Status: 404,
                        message: "incorrect password",
                    })
                }

            }
        }
        else {
            res.send({ message: "user does not exist" })
        }
    })
})


app.post("/adduser",jwtmiddleware, (req, res) => {
    const { username, date_of_birth, age, email, emp_id, password, category, designation, mobile_number, department } = req.body
    db.Employee.findOne({ emp_id }).then(user => {
        if (user) {
            res.send({ message: "already exist" })
        } else {
            const user = new db.Employee({
                username,
                date_of_birth,
                age,
                email,
                emp_id,
                password,
                category,
                designation,
                mobile_number,
                department

            })
            const emp = new db.User({
                username,
                emp_id,
                password,
                category
            })

            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "added successfully" })
                }
            })
            emp.save()
        }
    })
})

app.post("/viewall", (req, res) => {
    db.Employee.find().then(user => {
        res.send(user)
    })
})



app.post("/adddepartment", (req, res) => {
    const { department_name, department_id } = req.body
    db.Department.findOne({ department_name }).then(department => {
        if (department) {
            res.send({ message: "Already exist" })
        }
        else {
            const department = new db.Department({
                department_name,
                department_id
            })
            department.save()
            res.send({ message: "Department added successfully" })
        }
    })
})

app.post("/viewdepartment", (req, res) => {
    db.Department.find().then(item => {
        res.send(item)
    })
})

// app.post("/delete/:emp_id", (req, res) => {

//     try {
//         db.Employee.findByIdAndUpdate(req.params.emp_id, { deleted: true })
//         db.User.findByIdAndUpdate(req.params.emp_id, { deleted: true })

//         res.status(200).json("user deleted")
//     } catch (error) {
//         res.status(500).json(error)
//     }

// })

app.post("/delete", (req, res) => {
    const { emp_id } = req.body

    db.User.findOne({ emp_id: emp_id }).then(user => {
        if (user) {
            db.User.findOneAndUpdate({ emp_id }, { $set: { deleted: true } }).then(data => {
                data.save()
            })
            db.Employee.findOneAndUpdate({ emp_id }, { $set: { deleted: true } }).then(data => {
                data.save()
            })
            res.send("user deleted")
        }
    })

})

app.put("/edituser", (req, res) => {
    const { username, date_of_birth, age, emp_id, email, password, designation, department, mobile_number, } = req.body
    db.Employee.findOneAndUpdate({ emp_id: emp_id },
        { $set: { username, date_of_birth, age, emp_id, email, password, designation, department, mobile_number } })

        .then(user => {
            if (user) {
                res.send({ message: " data updated successfully" })
            } else {
                res.send({ message: "invalid inputs" })
            }

        })
        db.User.findOneAndUpdate({emp_id:emp_id},
            {$set:{username,password,emp_id}}).then(result=>{
                result.save()
            })
})

app.post("/leaveapproval", jwtmiddleware,(req, res) => {
    const { emp_id, from_date, to_date, days, reason, status } = req.body
    db.Leave.findOne({ emp_id ,from_date, to_date, days, reason}).then(result => {
        if (result) {
            if (result.status == "pending" || "rejected") {

                db.Leave.findOneAndUpdate({ emp_id: emp_id }, { $set: { status: "approved" } }).then(data => {
                    data.save()
                })
                res.send({ message: "leave approved" })
            }
            else {
                res.send({ message: "rejected" })
            }
        } else {
            res.send({ message: "Leave request not found" })
        }
    })
})
app.post("/leaverejection",jwtmiddleware, (req, res) => {
    const { emp_id, from_date, to_date, days, reason, status } = req.body
    db.Leave.findOne({ emp_id               ,from_date, to_date, days, reason }).then(result => {
        if (result) {
            if (result.status == "pending" || "approved") {

                db.Leave.findOneAndUpdate({ emp_id: emp_id }, { $set: { status: "rejected" } }).then(data => {
                    data.save()
                })
                res.send({ message: "leave request rejected" })
            }
            else {
                res.send({ message: "rejected" })
            }
        } else {
            res.send({ message: "leave requset not found" })
        }
    })
})


app.post("/applications", (req, res) => {
    db.Leave.find().then(result => {
        res.send(result)
    })
})


// // employee functionalities

app.post("/mydetails",jwtmiddleware, (req, res) => {
    const { emp_id } = req.body
  db.Employee.findOne({ emp_id }).then(user => {
      if(user.deleted === true){
          res.send({message:"user terminated....cannot perform this action"})
      }else{
        res.send(user)
      }
        
    })
})


app.put("/editmydetails", jwtmiddleware, (req, res) => {
    const { username, emp_id, email, mobile_number } = req.body
    db.Employee.findOneAndUpdate({ emp_id: emp_id }, { $set: { email, mobile_number } }).then(user => {
        if(user.deleted === true){
            res.send({message:"user terminated....cannot perform this action"})
        }else{
          res.send({ message: "your data updated successfully" })
        }
    })
})

app.post("/leavelist", (req, res) => {
    const { emp_id } = req.body
    db.Leave.findOne({ emp_id: emp_id }).then(result => {
        res.send(result)
    })
})

app.post("/leaverequest",jwtmiddleware, (req, res) => {
    const { emp_id, from_date, to_date, days, reason } = req.body
    db.Leave.findOne({ emp_id, from_date, to_date, days, reason }).then(result => {
        if (result) {
            res.send({ message: "already applied leave on this date" })
        } else {
            const leave = new db.Leave({
                emp_id,
                from_date,
                to_date,
                days,
                reason
            })
            leave.save()
            res.send({ message: "Your leave request submitted successfully" })
        }
    })
})


app.listen(4000, () => {
    console.log("server is up and runs at 4000");
})