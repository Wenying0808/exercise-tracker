const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log('Connected to MongoDB!')})

const userSchema = new mongoose.Schema({
  username: String
});
User = mongoose.model('User', userSchema);

app.use(cors())
app.use(express.static('public'))
//add middleware
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const name = req.body.username;
  res.json({
    username: name
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
