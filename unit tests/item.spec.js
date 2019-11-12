
'use strict'

const Accounts = require('../modules/user.js')
const Item = require('../modules/item.js')

const Database = require('sqlite-async')
const dbName = 'website.db'

describe('add item', () => {

    test('adding a new item', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()
        const addedItem = await newItem.addItem("1", "monalisa", 1000, "nice", "very nice");

		expect(addedItem).toBe(true)
		done()
    })

    test('missing title', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()

		await expect( newItem.addItem("1", "", 1000, "nice", "very nice") )
			.rejects.toEqual( Error('missing title') )
		done()
    })

    test('missing price', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()

		await expect( newItem.addItem("1", "monalisa", null, "nice", "very nice") )
			.rejects.toEqual( Error('missing price') )
		done()
    })

    test('missing short desc', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()
 
		await expect( newItem.addItem("1", "monalisa", 1000, "", "very nice") )
			.rejects.toEqual( Error('missing short description') )
		done()
    })

    test('missing long desc', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()
 
		await expect( newItem.addItem("1", "monalisa", 1000, "nice", "") )
			.rejects.toEqual( Error('missing long description') )
		done()
    })


    /*
    test('get userID associated with item', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()
        await newItem.addItem("1", "monalisa", 1000, "nice", "very nice");
        
        const sql = 'SELECT userID FROM items WHERE id = 1;'    //getting the user for first item
		const db = await Database.open(dbName)
		const data = await db.all(sql)
		await db.close()

		expect(data).toEqual(1)
		done()
    })
    */
   
})

describe('markSold()', () => {
    test('mark item as sold', async done => {
        expect.assertions(1)
        //setup of item
        const newItem = await new Item()
        await newItem.addItem(1, "monalisa", 1000, "nice", "very nice");

        const markSold = await newItem.markSold(1);

		expect(markSold).toBe(true)
		done()
	})
})

/*
describe('markSold()', () => {

})
*/
