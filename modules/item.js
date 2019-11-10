
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

    constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
            const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, smallPic BLOB, picture BLOB, name TEXT, price INTEGER, shortDesc TEXT, longDesc TEXT, sold BOOLEAN);'
            
			await this.db.run(sql)
			return this
		})()
	}

}