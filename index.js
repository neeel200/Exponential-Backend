const express = require("express");
const cors = require("cors");
const calculateRewards = require("./jobs/calculateRewards");
const User = require("./models/user");
const errorController = require("./utils/errorController");
const tryCatch = require("./utils/tryCatch");
const connectDb = require("./DB/config");
const app = express();
const dotenv = require("dotenv");
const customError = require("./utils/customError");

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

dotenv.config({ path: ".env.example" });

// Connect to MongoDB
connectDb();

// API Endpoints
app.post(
  "/click",
  tryCatch(async (req, res) => {
    const { userId } = req.body;
 

    let user = "";

    // user alredy exists
    if (userId) {
    
      user = (await User.findById(userId))
    }

    // new user
    if (!user ) {
      user = await User.create({
        counter: 0,
        points: 0,
        prizes: 0,
      });
    }
   
    // increase the counter and on the basis of probability get rewards and upate the points accordingly

    user.counter = user.counter + 1;
    const { reward, points } = calculateRewards();

    if (reward) updatuser.prizes = user.prizesedPrizes + 1;

    user.points = user.points + points;

    const savedUser = await user.save();

    return res.status(200).json({ success: true, data: savedUser });
  })
);

app.get(
  "/user/:id",
  tryCatch(async (req, res) => {
    const { id } = req.params;

    // get the user's data

    const user = await User.findById(id);
    return res.status(200).json(user || { counter: 0, points: 0, prizes: 0 });
  })
);

app.get("/health", (req, res) => {
  res.send("API is running...");
});

// Error handlers
app.all("*", (req, res, next) => {
  next(new customError(`cant find the ${req.originalUrl}`, 404));
});
app.use(errorController);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
