const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const app = express()
const cors = require('cors')
const User = require('./Models/Users')
require('dotenv').config()
const port = process.env.PORT

app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
const secretKey = process.env.SECRET

const updateOTP = (email, OTP) => {
    User.updateOne(
        {
            "email": email
        },
        {
            $set: {
                otp: OTP
            }
        }
    ).then(result => {
        console.log(result);
        // Handle the success case
    }).catch(err => {
        console.error(err);
        // Handle the error
    })
}

const sendmail = (email) => {
    const OTP_LENGTH = 10
    const OTP_CONFIG = {
        upperCaseAlphabets: true,
        specialChars: false
    }

    const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'schedular46@gmail.com',
            pass: 'gvon clln erzr wqrz '
        }
    });

    let OTP_mailDetails = {
        from: 'schedular46@gmail.com',
        to: email,
        subject: 'OTP',
        html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome ${email}</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Please enter the sign in OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
      </div>
    `,
    };

    mailTransporter.sendMail(OTP_mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs ' + err);
        } else {
            console.log('Email sent successfully');
        }
    });
    updateOTP(email, OTP);
}

const generateToken = (user) => {
    const payload = { role: user.role, email: user.email };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

//routes
//login role with email
app.post('/user/login', async (req, res) => {
    try {
        const user = req.body;
        if (await User.findOne(user)) {
            sendmail(user.email);
            const token = generateToken(user);
            res.status(200).json({ msg: 'logged in successfully', user: token })
        } else {
            res.status(401).json({ msg: 'user authentication failed', user: false })
        }
    } catch (error) {
        res.json({ message: 'error' })
    }
})

app.post('/user/otp', async (req, res) => {
    try {
        const user = req.body;
        if (await User.findOne(user)) {
            const token = generateToken(user);
            res.status(200).json({ msg: 'logged in successfully', user: token, role: user.role })
        } else {
            res.status(401).json({ msg: 'user authentication failed', user: false })
        }
    } catch (error) {
        res.json({ message: 'error' })
    }
})

app.listen(port, () => {
    console.log('app is running on ' + port)
})