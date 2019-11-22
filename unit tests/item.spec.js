
'use strict'

const Accounts = require('../modules/user.js')
const Item = require('../modules/item.js')

describe('add item', () => {

	test('adding a new item', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const newItem = await new Item()
		const addedItem = await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		expect(addedItem).toBe(true)
		done()
	})

	test('missing userID', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const newItem = await new Item()

		await expect( newItem.addItem(null, '', 1000, 'nice', 'very nice') )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

	test('missing title', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const newItem = await new Item()

		await expect( newItem.addItem(1, '', 1000, 'nice', 'very nice') )
			.rejects.toEqual( Error('missing title') )
		done()
	})

	test('missing price', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const newItem = await new Item()

		await expect( newItem.addItem(1, 'monalisa', null, 'nice', 'very nice') )
			.rejects.toEqual( Error('missing price') )
		done()
	})

	test('missing short desc', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const newItem = await new Item()

		await expect( newItem.addItem(1, 'monalisa', 1000, '', 'very nice') )
			.rejects.toEqual( Error('missing short description') )
		done()
	})

	test('missing long desc', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const newItem = await new Item()

		await expect( newItem.addItem(1, 'monalisa', 1000, 'nice', '') )
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
        await newItem.addItem(1, "monalisa", 1000, "nice", "very nice");

        const sql = 'SELECT userID FROM items WHERE id = 1;'    //getting the user for first item
		const db = await Database.open(dbName)
		const data = await db.all(sql)
		await db.close()

		expect(data).toEqual(1)
		done()
    })
    */

})

describe('markAsSold()', () => {
	test('buyer/seller succesfully saved to db', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		//seller id and buyer id
		const markSold = await newItem.markAsSold(1, 2, 1)

		expect(markSold).toBe(true)
		done()
	})

	test('invalid sellerID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		await expect( newItem.markAsSold(null, 2, 1) )
			.rejects.toEqual( Error('missing sellerID') )
		done()
	})

	test('invalid buyerID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		await expect( newItem.markAsSold(1, null, 1) )
			.rejects.toEqual( Error('missing buyerID') )
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		await expect( newItem.markAsSold(1, 2, null) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})


})

describe('isInterested()', () => {
	test('user is already interested', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await newItem.addInterestedUser(1, 1)

		const result = await newItem.isInterested(1, 1)

		expect(result).toBe(true)
		done()
	})

	test('user is not currently interested', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.isInterested(1, 1)

		expect(result).toBe(false)
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.isInterested(1, null) )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.isInterested(null, 1) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})
})

describe('numberOfInterested()', () => {
	test('1 interested user', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await newItem.addInterestedUser(1, 1)

		const result = await newItem.numberOfInterested(1)

		expect(result).toBe(1)
		done()
	})

	test('no interested users', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.numberOfInterested(1, 1)

		expect(result).toBe(0)
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.numberOfInterested(null) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

})

describe('userNumberInterest()', () => {
	test('1 interested user', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await newItem.addInterestedUser(1, 1)

		const result = await newItem.userNumberInterest(1)

		expect(result).toBe(1)
		done()
	})

	test('no interested users', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.userNumberInterest(1, 1)

		expect(result).toBe(0)
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.userNumberInterest(null) )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

})

describe('addInterestedUser()', () => {

	test('adding an user interested in the item', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.addInterestedUser(1, 1)

		expect(result).toBe(true)
		done()
	})

	test('adding duplicate users of interest', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await newItem.addInterestedUser(1, 1)

		await expect( newItem.addInterestedUser(1, 1) )
			.rejects.toEqual( Error('user 1 already interested in this item') )
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.addInterestedUser(1, null) )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.addInterestedUser(null, 1) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})
})

describe('removeInterestedUser()', () => {

	test('removing an interested user', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await newItem.addInterestedUser(1, 1)
		const result = await newItem.removeInterestedUser(1,1)

		expect(result).toBe(true)
		done()
	})

	test('removing non existent user of interest', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		//await newItem.addInterestedUser(1, 1);

		await expect( newItem.removeInterestedUser(1, 1) )
			.rejects.toEqual( Error('user 1 NOT interested in this item') )
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.removeInterestedUser(1, null) )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.removeInterestedUser(null, 1) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

})

describe('getUserIDFromItemID()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.getUserIDFromItemID(1)

		expect(result).toBe(1)
		done()
	})

	test('appropriate setup with multiple items', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(2, 'TWOmonalisa', 2000, 'TWOnice', 'very TWO nice')
		await newItem.addItem(2, 'THREEmonalisa', 3000, 'THREEnice', 'very THREE nice')

		const result = await newItem.getUserIDFromItemID(3)

		expect(result).toBe(2)
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.getUserIDFromItemID(null) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

})
