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
const User = mongoose.model('User', userSchema);

const exerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

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
      username: savedUser.username,
      _id: savedUser._id,
    })
  } catch (err) {
    console.error("Error save new user", err)
  }
})

app.post('/api/users/:_id/exercises', async(req, res) => {

  const userId = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  try {
    // find the user name in db
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        error: 'User not found'
      })
    } else {
      // create new instance of the exercise model
      const newExercise = new Exercise({
        user_id: user._id,
        description: description,
        duration: duration,
        date: date,
      });
      // save to db
      const savedExercise = await newExercise.save();
      res.json({
        username: user.username,
        description: savedExercise.description,
        duration: savedExercise.duration,
        date: savedExercise.date.toDateString(),
        _id: user._id,
      })
    }

  } catch (err){
    console.error("Error saving new exercise", err)
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
