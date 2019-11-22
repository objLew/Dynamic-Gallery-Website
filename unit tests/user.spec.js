
'use strict'

const Accounts = require('../modules/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		await expect( account.register('doej', 'doej@gmail.com', 'doejpal', 'password'))
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect( account.register('', 'doej@gmail.com', 'doejpal', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect( account.register('doej', 'doej@gmail.com', 'doejpal', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	test('invalid email', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect( account.register('doej', '', 'doejpal', 'password') )
			.rejects.toEqual( Error('missing email') )
		done()
	})

	test('invalid paypal', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect( account.register('doej', 'doej@gmail.com', '', 'password') )
			.rejects.toEqual( Error('missing paypal') )
		done()
	})

})
/*
describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
})
*/

describe('login()', () => {
	test('log in with valid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		const valid = await account.login('doej','password')
		expect(valid).toBe(1)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await expect( account.login('roej','password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await expect( account.login('doej','bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('getDetails()', () => {
	test('get details of valid user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')

		const userData = await account.getDetails(1)

		expect(userData[0].id).toBe(1)
		done()
	})

	test('get details of valid user with multiple users', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'doej@gmail.com', 'doejpal', 'password')
		await account.register('doej1', 'doejONE@gmail.com', 'doejpal1', 'password1')
		await account.register('doej2', 'doej2@gmail.com', 'doejpal2', 'password2')

		const userData = await account.getDetails(2)

		expect(userData[0].email).toBe('doejONE@gmail.com')
		done()
	})

	test('access non existent user', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect( account.getDetails(5) )
			.rejects.toEqual( Error('user does not exist') )
		done()
	})

	test('invalid userID', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect( account.getDetails(null) )
			.rejects.toEqual( Error('missing userID') )
		done()
	})

})
