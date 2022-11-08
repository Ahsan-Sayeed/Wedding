require('dotenv').config();
const password = process.env.DB_PASS;
const uri = `mongodb+srv://user1:${password}@cluster0.36zkm2g.mongodb.net/?retryWrites=true&w=majority` || "mongodb://localhost:27017/users";
module.exports = uri