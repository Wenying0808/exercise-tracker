const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log('Connected to MongoDB!')})
.catch(err => console.error('Error connecting to MongoDB:', err));

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

app.post('/api/users', async(req, res) => {
  const name = req.body.username;
  
  try {
    // create new instance of the user model
    const newUser = new User({ username: name });

    // save new user to database
    const savedUser = await newUser.save();

    res.json({
      username: savedUser.username
    })
  } catch (err) {
    console.error("Error save new user", err)
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
