
'use strict'

// const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')

module.exports = class items {

    constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// creating a table to store item information
            const sql = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, smallPic BLOB, picture BLOB, name TEXT, price INTEGER, shortDesc TEXT, longDesc TEXT, sold BOOLEAN);'
            const sql = 'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT,  sellerPayPal TEXT, buyerPayPal TEXT, itemID INTEGER);'
			await this.db.run(sql)
			return this
		})()
	}

	async uploadPicture(path, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		//await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
	}
	
}