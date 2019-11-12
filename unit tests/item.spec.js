
'use strict'

const Accounts = require('../modules/item.js')


describe('add item', () => {

    test('user associated with item', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        const register = await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()
        const addedItem = newItem.addItem("1", "monalisa", 1000, "nice", "very nice");

		expect(addedItem).toBe(true)
		done()
    })

    test('get userID associated with item', async done => {
        expect.assertions(1)
        //setup account
		const account = await new Accounts()
        const register = await account.register('doej', 'password')
        
        //setup of item
        const newItem = await new Item()
        newItem.addItem("1", "monalisa", 1000, "nice", "very nice");
        
        const sql = 'SELECT userID FROM items WHERE id = 1;'    //getting the user for first item
		const db = await Database.open(dbName)
		const data = await db.all(sql)
		await db.close()

		expect(data).toEqual(1)
		done()
    })
    
    test('mark item as sold', async done => {
        expect.assertions(1)
        //setup of item
        const newItem = await new Item()
        newItem.addItem(1, "monalisa", 1000, "nice", "very nice");
        const markSold = newItem.markSold(1);
		expect(markSold).toBe(true)
		done()
	})

})
