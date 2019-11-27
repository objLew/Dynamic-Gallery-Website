
'use strict'

const Accounts = require('../modules/user.js')
const Item = require('../modules/item.js')

describe('add item', () => {

	test('adding a new item', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		const newItem = await new Item()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item
		const addedItem = await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		expect(addedItem).toBe(true)
		done()
	})

	test('missing userID', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		const newItem = await new Item()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item

		await expect( newItem.addItem(null, '', 1000, 'nice', 'very nice') )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

	test('missing title', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		const newItem = await new Item()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item

		await expect( newItem.addItem(1, '', 1000, 'nice', 'very nice') )
			.rejects.toEqual( Error('missing title') )
		done()
	})

	test('missing price', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		const newItem = await new Item()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item

		await expect( newItem.addItem(1, 'monalisa', null, 'nice', 'very nice') )
			.rejects.toEqual( Error('missing price') )
		done()
	})

	test('missing short desc', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		const newItem = await new Item()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item

		await expect( newItem.addItem(1, 'monalisa', 1000, '', 'very nice') )
			.rejects.toEqual( Error('missing short description') )
		done()
	})

	test('missing long desc', async done => {
		expect.assertions(1)
		//setup account
		const account = await new Accounts()
		const newItem = await new Item()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		//setup of item

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

describe('isSold()', () => {
	test('item not sold', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const markSold = await newItem.isSold(1)

		expect(markSold).toBe(false)
		done()
	})

	test('item is sold', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await newItem.markAsSold(1, 2, 1)

		const markSold = await newItem.isSold(1)

		expect(markSold).toBe(true)
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		await expect( newItem.isSold(null) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

	test('item does not exist', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()


		await expect( newItem.isSold(1) )
			.rejects.toEqual( Error('item does not exist') )
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

	test('accessing non existent item', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.getUserIDFromItemID(5) )
			.rejects.toEqual( Error('item does not exist') )
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

describe('sendEmail()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		const itemOwner = await account.getDetails(1)
		const interestedUser = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		const result = await newItem.sendEmail(itemDetails, itemOwner, interestedUser, 'subject', 'body of email', 5)

		expect(result).toBe(true)
		done()
	})

	test('invalid item', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemOwner = await account.getDetails(1)
		const interestedUser = await account.getDetails(2)

		await expect( newItem.sendEmail(null, itemOwner, interestedUser, 'subject test', 'body of email - test', 5) )
			.rejects.toEqual( Error('missing item') )
		done()
	})

	test('invalid owner ID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const interestedUser = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendEmail(itemDetails, null, interestedUser, 'subject test', 'body of email - test', 5) )
			.rejects.toEqual( Error('missing itemOwner') )
		done()
	})

	test('invalid interested user ID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemOwner = await account.getDetails(1)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendEmail(itemDetails, itemOwner, null, 'subject', 'body of email', 5) )
			.rejects.toEqual( Error('missing interestedUser') )
		done()
	})

	test('invalid email subject', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemOwner = await account.getDetails(1)
		const interestedUser = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendEmail(itemDetails, itemOwner, interestedUser, '', 'body of email', 5) )
			.rejects.toEqual( Error('missing subject') )
		done()
	})

	test('invalid email body', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemOwner = await account.getDetails(1)
		const interestedUser = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendEmail(itemDetails, itemOwner, interestedUser, 'subject', '', 5) )
			.rejects.toEqual( Error('missing email body') )
		done()
	})

	test('invalid offer', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemOwner = await account.getDetails(1)
		const interestedUser = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendEmail(itemDetails, itemOwner, interestedUser, 'subject', 'body of email', null) )
			.rejects.toEqual( Error('missing offer') )
		done()
	})

})

describe('sendPayPalEmail()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		const sellerDetails = await account.getDetails(1)
		const buyerDetails = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		const result = await newItem.sendPayPalEmail(itemDetails, sellerDetails, buyerDetails)

		expect(result).toBe(true)
		done()
	})

	test('invalid item', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const sellerDetails = await account.getDetails(1)
		const buyerDetails = await account.getDetails(2)

		await expect( newItem.sendPayPalEmail(null, sellerDetails, buyerDetails) )
			.rejects.toEqual( Error('missing item') )
		done()
	})

	test('invalid owner ID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const buyerDetails = await account.getDetails(2)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendPayPalEmail(itemDetails, null, buyerDetails) )
			.rejects.toEqual( Error('missing seller') )
		done()
	})

	test('invalid interested user ID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const account = await new Accounts()

		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const sellerDetails = await account.getDetails(1)
		const itemDetails = await newItem.getDetails(1)

		await expect( newItem.sendPayPalEmail(itemDetails, sellerDetails, null) )
			.rejects.toEqual( Error('missing buyer') )
		done()
	})

})

describe('getDetails()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.getDetails(1)

		expect(result[0].title).toBe('monalisa')
		done()
	})

	test('get details with multiple items', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(1, 'TWOmonalisa', 2000, 'TWOnice', 'TWOvery nice')
		await newItem.addItem(2, 'THREEmonalisa', 3000, 'THREEnice', 'THREE very nice')

		const result = await newItem.getDetails(2)

		expect(result[0].title).toBe('TWOmonalisa')
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		await expect( newItem.getDetails(null) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

	test('non existent item', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		await expect( newItem.getDetails(5) )
			.rejects.toEqual( Error('item does not exist') )
		done()
	})

})

describe('getUsersItems()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.getUsersItems(1)

		expect(result[0].title).toBe('monalisa')
		done()
	})

	test('get all items with multiple items', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(1, 'TWOmonalisa', 2000, 'TWOnice', 'TWOvery nice')
		await newItem.addItem(2, 'THREEmonalisa', 3000, 'THREEnice', 'THREE very nice')

		const result = await newItem.getUsersItems(1)

		expect(result[1].title).toBe('TWOmonalisa')
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')


		await expect( newItem.getUsersItems(null) )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

	test('non existent user', async done => {
		expect.assertions(1)
		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.getUsersItems(5)

		expect(result).toBe(false)
		done()
	})

})


describe('allItemWithInterest()', () => {
	test('get all items with multiple items', async done => {
		expect.assertions(1)
		//setup of item
		const item = await new Item()

		await item.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await item.addItem(1, 'TWOmonalisa', 2000, 'TWOnice', 'TWOvery nice')
		await item.addItem(2, 'THREEmonalisa', 3000, 'THREEnice', 'THREE very nice')

		item.addInterestedUser(2, 1)
		item.addInterestedUser(2, 2)

		const result = await item.allItemWithInterest()

		expect(result[1].interest).toBe(2)
		done()
	})

	test('no interest', async done => {
		expect.assertions(1)
		//setup of item
		const item = await new Item()

		await item.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await item.allItemWithInterest()

		expect(result[0].interest).toBe(0)
		done()
	})

	test('non existent items', async done => {
		expect.assertions(1)
		//setup of item
		const item = await new Item()

		const result = await item.allItemWithInterest()

		expect(result).toBe(false)
		done()
	})

})

describe('search()', () => {
	test('succesful search', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.search('nice')

		expect(result[0].title).toBe('monalisa')
		done()
	})

	test('succesful search with multiple items', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(1, 'monalisa2', 2000, '2nice', '2very nice')

		const result = await newItem.search('nice')

		expect(result[1].title).toBe('monalisa2')
		done()
	})

	test('invalid querystring', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()

		await expect( newItem.search('') )
			.rejects.toEqual( Error('missing querystring') )
		done()
	})

	test('invalid querystring', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()

		await expect( newItem.search('abcdef') )
			.rejects.toEqual( Error('no items exist for this search') )
		done()
	})

})

describe('givenItemsWithInterest()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemDetails = await newItem.getDetails(1)

		const result = await newItem.givenItemsWithInterest(itemDetails)

		expect(result[0].interest).toBe(0)
		done()
	})

	test('appropriate setup with interest', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const itemDetails = await newItem.getDetails(1)
		await newItem.addInterestedUser(1, 1)

		const result = await newItem.givenItemsWithInterest(itemDetails)

		expect(result[0].interest).toBe(1)
		done()
	})

})

describe('getItemsToUpdate()', () => {
	test('succesful update of specified fields', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		const body = {title: 'new', price: 1, shortDesc: 'new new', longDesc: 'new new new'}

		const itemData = await newItem.getDetails(1)

		const result = await newItem.getItemsToUpdate(itemData, body)

		expect(result[0].title).toBe('new')
		done()
	})

	test('succesful update with multiple items', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(1, 'monalisa2', 2000, '2nice', '2very nice')

		const body = {title: 'new', price: 1, shortDesc: 'new new', longDesc: 'new new new'}

		const itemData = await newItem.getDetails(2)

		const result = await newItem.getItemsToUpdate(itemData, body)

		expect(result[0].title).toBe('new')
		done()
	})
})


describe('updateItem()', () => {
	test('succesful update of specified fields', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const body = {title: 'new', price: 1, shortDesc: 'new new', longDesc: 'new new new'}

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')

		const result = await newItem.updateItem(1, body)

		expect(result).toBe(true)
		done()
	})

	test('succesful update with multiple items', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const body = {title: 'new', price: 1, shortDesc: 'new new', longDesc: 'new new new'}

		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(1, 'monalisa2', 2000, '2nice', '2very nice')
		await newItem.addItem(1, 'monalisa3', 2000, '3nice', '3very nice')


		const result = await newItem.updateItem(2, body)

		expect(result).toBe(true)
		done()
	})

	test('invalid itemID', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const body = {title: 'new', price: 1, shortDesc: 'new new', longDesc: 'new new new'}

		await expect( newItem.updateItem(null, body) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

	test('no items exist to update', async done => {
		expect.assertions(1)

		//setup of item
		const newItem = await new Item()
		const body = {title: 'new', price: 1, shortDesc: 'new new', longDesc: 'new new new'}

		await expect( newItem.updateItem(2, body) )
			.rejects.toEqual( Error('item does not exist') )
		done()
	})

})

describe('deleteItem()', () => {

	test('deleting an item', async done => {
		expect.assertions(1)
		//setup account
		const newItem = await new Item()

		//setup of item
	 	await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		const result = await newItem.deleteItem(1)

		expect(result).toBe(true)
		done()
	})

	test('deleting an item with multiple items', async done => {
		expect.assertions(1)
		//setup account
		const newItem = await new Item()

		//setup of item
		await newItem.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		await newItem.addItem(1, 'monalisa2', 2000, '2nice', '2very nice')
		await newItem.addItem(1, 'monalisa3', 2000, '3nice', '3very nice')

		const result = await newItem.deleteItem(2)

		expect(result).toBe(true)
		done()
	})


	test('missing itemID', async done => {
		expect.assertions(1)
		//setup account
		const newItem = await new Item()


		await expect( newItem.deleteItem(null) )
			.rejects.toEqual( Error('missing itemID') )
		done()
	})

	test('item does not exist', async done => {
		expect.assertions(1)
		//setup account
		const newItem = await new Item()


		await expect( newItem.deleteItem(5) )
			.rejects.toEqual( Error('item does not exist') )
		done()
	})

})


/*
describe('getImages()', () => {
	test('appropriate setup', async done => {
		expect.assertions(1)
		//setup of item
		const item = await new Item()

		await item.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		const itemDetails = await item.getDetails(1)

		const result = await item.getImages(itemDetails)

		expect().toBe()
		done()
	})

	test('get all items with multiple images', async done => {
		expect.assertions(1)
		//setup of item
		const item = await new Item()

		await item.addItem(1, 'monalisa', 1000, 'nice', 'very nice')
		const itemDetails = await item.getDetails(1)

		const result = await item.getImages(itemDetails)

		expect().toBe()
		done()
	})

	test('no images', async done => {
		expect.assertions(1)
		//setup of item
		const item = await new Item()

		await expect( item.allItemWithInterest() )
			.rejects.toEqual( Error('no images exist') )
		done()
	})

})
*/
