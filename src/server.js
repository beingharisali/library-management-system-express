require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

const booksRouter = require('./routes/books')

app.use(express.json())
app.use('/api/v1/books', booksRouter)

app.get('/health',(req, res)=>{
    res.status(200).json({
        success:true,
        msg:"health 100%"
    })
})
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
