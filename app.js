const express = require("express")
const app = express()
require("dotenv").config()

const tasks = require("./Routes/tasks")
const connectDB = require("./DB/connect")


app.use(express.static("./Public"))
app.use(express.json())
app.use("/api/tasks", tasks)


const port = process.env.PORT || 3000


const start = async () => {

    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server listening on Port ${port}...`))
    } 
    
    catch (error) {
        console.log(error)
    }

}

start()
