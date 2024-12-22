require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dummy_users_unique.json`, 'utf-8'),
);

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Firstname is required'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is requried'],
    unique: true,
    trim: true,
    // validate: [validator.isEmail, 'Provide valid email'],
  },
  role: {
    type: String,
    // enum: Object.values(Role),
    // default: Role.DEVELOPER,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [3, 'Password must be atleast 3 char long'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required'],
    minlength: [3, 'Confirm password must be atleast 3 char long'],
    // validate: {
    //   message: 'Password does not match with confirm password',
    //   validator: function (value: string): boolean {
    //     return value === this.password; // this will only run when we save
    //   },
    // },
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photoUrl: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const User = mongoose.model('User', userSchema);

const connectToDb = async () => {
  try {
    const mongooseURL = process.env.ME_CONFIG_MONGODB_URL || '';

    await mongoose.connect(mongooseURL);
  } catch (error) {
    console.log('failed to connect database!!!');
  }
};

const importData = async () => {
  try {
    await connectToDb();
    await User.create(users);
    console.log('Data loaded successfully!!');
    process.exit();
  } catch (error) {
    console.log('failed to create tours');
  }
};

const deleteData = async () => {
  try {
    await connectToDb();
    await User.deleteMany();
    console.log('Data deleted successfully!!');
    process.exit();
  } catch (error) {
    console.log('failed to create tours');
  }
};

// console.log(process.argv);

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
