const express = require('express')
const userRouter = require("./routers/users")
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())                         // converts all sent req to json before recieving
app.use(userRouter)
app.use(taskRouter)

app.listen(port , ()=>{
    console.log('server running on port ' + port);
})


