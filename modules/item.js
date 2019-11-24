/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
/* eslint-disable complexity */

'use strict'

// const fs = require('fs-extra')
//const mime = require('mime-types')

const maxImages = 3
const fs = require('fs-extra')

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

	/**
	 * Adds an item to the database
	 * @name addItem
	 * @param {number} userID
	 * @param {string} title
	 * @param {number} price
	 * @param {string} shortDesc
	 * @param {string} longDesc
	 * @returns true if the item is successfully added to the database
	 */
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

	/**
	 *	Marks an item as sold, updates transaction table with the seller, buyer and item id
	 * @name markAsSold
	 * @param {number} sellerID
	 * @param {number} buyerID
	 * @param {number} itemID
	 * @returns true if item transaction is successfully marked as sold
	 */
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
			sql = `UPDATE items SET sold = true WHERE id = ${itemID}`
			await this.db.run(sql)

			return true
		} catch(err) {
			throw err
		}
	}

	/**
	 *	Checks if an item is sold
	 * @name isSold
	 * @param {number} itemID
	 * @returns true if the item is sold, false otherwise
	 */
	async isSold(itemID) {
		try {
			if(itemID === null || isNaN(itemID)) throw new Error('missing itemID')

			const sql = `SELECT sold FROM items WHERE id=${itemID};`
			const data = await this.db.get(sql)
			
			//check for undefined/empty
			if(!data || Object.keys(data).length === 0) throw new Error('item does not exist')
			
			//as we get a string, convert this to an explicit true/false
			if(data.sold == "false") {
				return false
			}
			else {
				return true
			}
		} catch(err) {
			throw err
		}
	}

	/**
	 * Checks if the user is interested in an item
	 * @name isInterested
	 * @param {number} itemID
	 * @param {number} userID
	 * @returns true if the user is interested in an item, false if not currently interested
	 */
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

	/**
	 * Correlates a user to an item to show they are interested
	 * @name addInterestedUser
	 * @param {number} itemID
	 * @param {number} userID
	 * @returns true if the user is successfully added
	 */
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

	/**
	 * Removed a user from the list of users interested in an item
	 * @name removeInterestedUser
	 * @param {number} itemID
	 * @param {number} userID
	 * @returns true if operation is successful
	 */
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

	/**
	 * Gets the amount of users interested in the item
	 * @name numberOfInterested
	 * @param {number} itemID
	 * @returns integer representing the amount of users interested in the item
	 */
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

	/**
	 * Gets the number of items the user is interested in
	 * @name userNumberInterest
	 * @param {number} userID
	 * @returns integer representing the number of items the user is interested in
	 */
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

	/**
	 *	Sends an email from the current user to the owner of the item
	 * @name sendEmail
	 * @param {Object} item - All details of an item eg. {id INTEGER, userID INTEGER, title TEXT, price INTEGER, shortDesc TEXT, longDesc TEXT, sold BOOLEAN}
	 * @param {Object} itemOwner - All user details eg. {id INTEGER, user TEXT, email TEXT, paypal TEXT, pass TEXT}
	 * @param {Object} interestedUser - All user details eg. {id INTEGER, user TEXT, email TEXT, paypal TEXT, pass TEXT}
	 * @param {string} subject
	 * @param {string} text
	 * @param {number} offer
	 * @returns true if email is successfully sent
	 */
	// eslint-disable-next-line max-params
	async sendEmail(item, itemOwner, interestedUser, subject, text, offer) {
		try{
			if(item === null) throw new Error('missing item')
			if(itemOwner === null) throw new Error('missing itemOwner')
			if(interestedUser === null) throw new Error('missing interestedUser')
			if(subject === null || subject.length === 0) throw new Error('missing subject')
			if(text === null || text.length === 0) throw new Error('missing email body')
			if(offer === null || isNaN(offer)) throw new Error('missing offer')


			const mailOptions = {
				from: `${interestedUser[0].email}`,
				to: `${itemOwner[0].email}`,
				subject: `${subject}`,
				text: `From: ${interestedUser[0].email}
				\n Queried Item: ${item[0].title}
				\n Original item price: £${item[0].price}
				\n ${interestedUser[0].user}'s message: ${text}
				\n Their offer: £${offer}`
			}

			transporter.sendMail(mailOptions, (error, info) => {
				//sending the email
			})

			return true
		} catch(err) {
			throw err
		}
	}

	/**
	 * Gets the id of the user that created the item
	 * @name getUserIDFromItemID
	 * @param {number} itemID
	 * @returns the id of the user that created the item
	 */
	async getUserIDFromItemID(itemID) {
		try{
			if(itemID === null || itemID.length === 0) throw new Error('missing itemID')

			const sql = `SELECT userID FROM items WHERE id = "${itemID}"`
			const data = await this.db.all(sql)

			if(Object.keys(data).length === 0) throw new Error('item does not exist')

			return data[0].userID
		} catch(err) {
			throw err
		}
	}

	/**
	 * Gets all the details of an item
	 * @name getDetails
	 * @param {number} itemID
	 * @returns all details of an item in an object.
	 */
	async getDetails(itemID) {
		try{
			if(itemID === null || itemID.length === 0) throw new Error('missing itemID')

			const sql = `SELECT * FROM items WHERE id = "${itemID}"`
			const data = await this.db.all(sql)

			if(Object.keys(data).length === 0) throw new Error('item does not exist')

			return data
		} catch(err) {
			throw err
		}
	}

	/**
	 * Get all items associated with a specified user
	 * @name getUsersItems
	 * @param {number} userID
	 * @returns Object with all items associated with the specified user
	 */
	async getUsersItems(userID) {
		try{
			if(userID === null || userID.length === 0) throw new Error('missing userID')

			const sql = `SELECT * FROM items WHERE userID = "${userID}"`
			const userItems = await this.db.all(sql)

			if(Object.keys(userItems).length === 0) throw new Error('user does not exist')

			return userItems
		} catch(err) {
			throw err
		}
	}

	/**
	 * Checks how many images exist
	 * @name getImages
	 * @param {Object} itemData
	 * @returns an array of image locations
	 */
	async getImages(itemData) {
		try{
			const images = []
			for(let i = 0; i < maxImages; i++) if(fs.existsSync(`public/items/${itemData[0].title}${i}.png`)) images.push(itemData[0].title+i)

			return images
		} catch(err) {
			throw err
		}
	}

	/**
	 * Gets the interest from users for each item
	 * @name allItemWithInterest
	 * @returns an array with all items and their interest level
	 */
	async allItemWithInterest() {
		try{
			const sql = 'SELECT * FROM items;'
			const data = await this.db.all(sql)

			if(Object.keys(data).length === 0) throw new Error('no items exist')

			const dataSize = Object.keys(data).length
			for (let i = 0; i < dataSize; i++) {
				data[i].interest = await this.numberOfInterested(data[i].id)
			}

			return data
		} catch(err) {
			throw err
		}
	}

}
