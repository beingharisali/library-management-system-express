require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

app.use(express.json())

app.get('/health',(req, res)=>{
    res.status(200).json({
        success:true,
        msg:"health 100%"
    })
})
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
