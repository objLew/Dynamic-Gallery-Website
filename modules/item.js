
'use strict'

// const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')

module.exports = class items {

    constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// creating a table to store item information
            const sql = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, title TEXT, price INTEGER, shortDesc TEXT, longDesc TEXT, sold BOOLEAN);'
			const sql2 = 'CREATE TABLE IF NOT EXISTS usersOfInterest (itemID INTEGER, userId INTEGER);'
			const sql3 = 'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT,  sellerPayPal TEXT, buyerPayPal TEXT, itemID INTEGER);'

			await this.db.run(sql)
			await this.db.run(sql2)
			await this.db.run(sql3)

			return this
		})()
	}

	async addItem(userID, title, price, shortDesc, longDesc){
		try {
			if(title.length === 0) throw new Error('missing title')
			if(price === null) throw new Error('missing price')
			if(shortDesc.length === 0) throw new Error('missing short description')
			if(longDesc.length === 0) throw new Error('missing long description')
			
			//Inserting new item details - sold is set to false by default
			const sql = `INSERT INTO items(userID, title, price, shortDesc, longDesc, sold) VALUES("${userID}", "${title}", "${price}", "${shortDesc}", "${longDesc}", "false")`
			await this.db.run(sql)

			return true
		} catch(err) {
			throw err
		}
	}
	
	async markAsSold(sellerPayPal, buyerPayPal, itemID){
		//inserting transaction
		let sql = `INSERT INTO transactions(sellerPayPal, buyerPayPal, itemID) VALUES("${sellerPayPal}", "${buyerPayPal}", "${itemID}")`
		await this.db.run(sql)

		//updating item to be sold
		sql = 'UPDATE items SET sold = true WHERE id = ?', [itemID]
		await this.db.run(sql)

		return true
	}
}