/* eslint-disable max-len */
/* eslint-disable complexity */

'use strict'

// const fs = require('fs-extra')
//const mime = require('mime-types')

const sqlite = require('sqlite-async')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'nodejsgalleryapp@gmail.com',
		pass: 'hanibalisthebest1'
	}
})


module.exports = class items {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// creating a table to store item information
			const sql = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, title TEXT, price INTEGER, shortDesc TEXT, longDesc TEXT, sold BOOLEAN);'
			const sql2 = 'CREATE TABLE IF NOT EXISTS usersOfInterest (itemID INTEGER, userID INTEGER);'
			const sql3 = 'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT,  sellerID INTEGER, buyerID INTEGER, itemID INTEGER);'

			await this.db.run(sql)
			await this.db.run(sql2)
			await this.db.run(sql3)

			return this
		})()
	}

	async addItem(userID, title, price, shortDesc, longDesc) {
		try {
			//TODO: unit test for lengths of everything
			if(userID === null || isNaN(userID)) throw new Error('missing userID')
			if(title === null || title.length === 0) throw new Error('missing title')
			if(price === null || isNaN(price)) throw new Error('missing price')
			if(shortDesc === null||shortDesc.length === 0) throw new Error('missing short description')
			if(longDesc.length === 0) throw new Error('missing long description')

			//Inserting new item details - sold is set to false by default
			const sql = `INSERT INTO items(userID, title, price, shortDesc, longDesc, sold) VALUES("${userID}", "${title}", "${price}", "${shortDesc}", "${longDesc}", "false")`
			await this.db.run(sql)

			return true
		} catch(err) {
			throw err
		}
	}

	async markAsSold(sellerID, buyerID, itemID) {
		try {
			if(sellerID === null || isNaN(sellerID)) throw new Error('missing sellerID')
			if(buyerID === null || isNaN(buyerID)) throw new Error('missing buyerID')
			if(itemID === null || isNaN(itemID)) throw new Error('missing itemID')

			//TODO - check if user exists

			//inserting transaction
			let sql = `INSERT INTO transactions(sellerID, buyerID, itemID) VALUES("${sellerID}", "${buyerID}", "${itemID}")`
			await this.db.run(sql)

			//updating item to be sold
			sql = 'UPDATE items SET sold = true WHERE id = ?', [itemID]
			await this.db.run(sql)

			return true
		} catch(err) {
			throw err
		}
	}

	//returns true if the user is interested in an item, false if not currently interested
	async isInterested(itemID, userID) {
		try{

			if(itemID === null || isNaN(itemID)) throw new Error('missing itemID')
			if(userID === null || isNaN(userID)) throw new Error('missing userID')

			const sql = `SELECT COUNT(${userID}) as records FROM usersOfInterest WHERE itemID="${itemID}" AND userID="${userID}";`
			const data = await this.db.get(sql)

			if(data.records !== 0) {
				return true
			} else{
				return false
			}

		} catch(err) {
			throw err
		}
	}

	async addInterestedUser(itemID, userID) {
		try {
			if(itemID === null || isNaN(itemID)) throw new Error('missing itemID')
			if(userID === null || isNaN(userID)) throw new Error('missing userID')

			//TODO - check if user exists

			let sql = `SELECT COUNT(${userID}) as records FROM usersOfInterest WHERE itemID="${itemID}" AND userID="${userID}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`user ${userID} already interested in this item`)

			sql = `INSERT INTO usersOfInterest(itemID, userID) VALUES("${itemID}", "${userID}")`
			await this.db.run(sql)

			return true
		} catch(err) {
			throw err
		}
	}

	async removeInterestedUser(itemID, userID) {
		try {
			if(itemID === null || isNaN(itemID)) throw new Error('missing itemID')
			if(userID === null || isNaN(userID)) throw new Error('missing userID')

			//TODO - check if user exists

			let sql = `SELECT COUNT(${userID}) as records FROM usersOfInterest WHERE itemID="${itemID}" AND userID="${userID}";`
			const data = await this.db.get(sql)
			if(data.records === 0) throw new Error(`user ${userID} NOT interested in this item`)

			sql = `DELETE FROM usersOfInterest WHERE itemID = ${itemID} AND userID = ${userID}`
			await this.db.run(sql)

			return true
		} catch(err) {
			throw err
		}
	}

	async numberOfInterested(itemID) {
		try{
			if(itemID === null || isNaN(itemID)) throw new Error('missing itemID')

			const sql = `SELECT COUNT(itemID) as records FROM usersOfInterest where itemID = ${itemID}`
			const data = await this.db.get(sql)

			return data.records
		} catch(err) {
			throw err
		}
	}

	async userNumberInterest(userID) {
		try{
			if(userID === null || isNaN(userID)) throw new Error('missing userID')

			const sql = `SELECT COUNT(userID) as records FROM usersOfInterest where userID = ${userID}`
			const data = await this.db.get(sql)

			return data.records
		} catch(err) {
			throw err
		}
	}

	async sendEmail(itemOwner, ineterestedUser, subject, text) {
		try{
			const mailOptions = {
				from: `${ineterestedUser[0].email}`,
				to: `${itemOwner[0].email}`,
				subject: `${subject}`,
				text: `${text}`
			}

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error)
				} else {
					console.log(`Email sent: ${ info.response}`)
				}
			})

			return true
		} catch(err) {
			throw err
		}
	}


}
