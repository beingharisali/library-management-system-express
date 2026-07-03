require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

const booksRouter = require('./routes/books')
const borrowRouter = require('./routes/borrow')
const returnRouter = require('./routes/return')
const memberRouter = require('./routes/members')

app.use(express.json())
app.use('/api/v1/books', booksRouter)
app.use('/api/v1/borrow', borrowRouter)
app.use('/api/v1/return', returnRouter)
app.use('/api/v1/members', memberRouter)

app.get('/health',(req, res)=>{
    res.status(200).json({
        success:true,
        msg:"health 100%"
    })
})
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
