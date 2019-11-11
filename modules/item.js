
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
            
			await this.db.run(sql)
			return this
		})()
	}
	
}