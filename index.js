const app = require('./app');
// const uri = require('./Config/Database');
// console.log(uri)

app.listen(5000,()=>{
    console.log(`server is running at http://localhost:5000`);
})