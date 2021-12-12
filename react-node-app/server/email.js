const nodemailer = require('nodemailer');
const env = require('dotenv').config()
const cron = require('node-cron');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
});

module.exports = {nodemailer, transporter, cron, env}