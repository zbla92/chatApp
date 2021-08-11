const express = require('express');
const path = require('path');
const cors = require('cors');

const bcrypt = require('bcrypt');
const { User } = require('./models');

const userRouter = require('./routes/user');

const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use('/user', userRouter);

app.listen(PORT, console.log(`Server running at port ${PORT}`));
