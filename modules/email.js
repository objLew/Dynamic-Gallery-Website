
'use strict'

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'nodejsgalleryapp@gmail.com',
		pass: 'hanibalisthebest1'
	}
})

module.exports = class items {


	constructor(itemOwner, ineterestedUser) {

		const mailOptions = {
			from: `${ineterestedUser[0].email}`,
			to: `${itemOwner[0].email}`,
			subject: 'Sending Email using Node.js',
			text: 'That was easy!'
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error)
			} else {
				console.log(`Email sent: ${ info.response}`)
			}
		})
	}
}
