#!/usr/bin/env node
/* eslint-disable max-lines */
/* eslint-disable no-var */
/* eslint-disable max-len */

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')

const Database = require('sqlite-async')
//const stat = require('koa-static')
//const handlebars = require('koa-hbs-renderer')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Item = require('./modules/item')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

const fs = require('fs-extra')


/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		await ctx.redirect('login')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The user registration page.
 *
 * @name Gallery Page
 * @route {GET} /gallery
 */
router.get('/gallery', async ctx => {
	try {
		const item = await new Item(dbName)

		const data = await item.allItemWithInterest()
		const auth = ctx.session.authorised

		await ctx.render('gallery', {data: data, auth: auth})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

// CHANGE TO /**
/*
 * The script to process new user registrations.
 *
 * @name Gallery Script
 * @route {POST} /gallery
 *
 * router.post('/gallery', koaBody, async ctx => {
 *	//implement post
 * })
 */


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)

		const {path, type} = ctx.request.files.avatar

		await fs.copy(path, `public/avatars/${body.user}.png`)

		// call the functions in the module
		const user = await new User(dbName)

		await user.register(body.user, body.email, body.paypal, body.pass)
		//await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


/**
 * The user login page.
 *
 * @name Login Page
 * @route {GET} /login
 */
router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})


/**
 * The script to process user logins.
 *
 * @name Login Script
 * @route {POST} /login
 */

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		const user = await new User(dbName)
		ctx.session.userID = await user.login(body.user, body.pass)
		ctx.session.authorised = true

		console.log(ctx.session.userID)

		return await ctx.redirect('gallery')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The user logout page.
 *
 * @name Logout Page
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})


/**
 * The page for users to add items.
 *
 * @name AddItem Page
 * @route {GET} /addItem
 * @authentication This route requires cookie-based authentication.
 */
router.get('/addItem', async ctx => {
	if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
	await ctx.render('addItem')
	console.log(ctx.session.userID)
})

/**
 * The script to process new items added.
 *
 * @name AddItem Script
 * @route {POST} /addItem
 */

router.post('/addItem', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		const item = await new Item(dbName)

		var {path, type} = ctx.request.files.pic1
		await fs.copy(path, `public/items/${body.title}1.png`)

		var {path, type} = ctx.request.files.pic2
		await fs.copy(path, `public/items/${body.title}2.png`)

		var {path, type} = ctx.request.files.pic3
		await fs.copy(path, `public/items/${body.title}3.png`)


		await item.addItem(ctx.session.userID, body.title, body.price, body.shortDesc, body.longDesc)

		await ctx.redirect('/gallery')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * Page to display items.
 *
 * @name Items Page
 * @route {GET} /items/:index
 * @authentication This route requires cookie-based authentication.
 */
router.get('/items/:index', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const item = await new Item(dbName)
		const user = await new User(dbName)

		//Getting information on items from items DB
		const itemData = await item.getDetails(ctx.params.index)

		//Getting information on items from items DB
		const userID = await itemData[0].userID
		const userData = await user.getDetails(userID)

		//getting the images for the item
		const images = await item.getImages(itemData)

		const interested = await item.isInterested(ctx.params.index, ctx.session.userID)
		const numberOfInterested = await item.numberOfInterested(ctx.params.index)
		await ctx.render('items', {image: images, item: itemData, user: userData, interested: interested, numberOfInterested: numberOfInterested})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


/**
 * The page to handle users adding interest.
 *
 * @name Interested Page
 * @route {GET} /items/:index/interested
 */
router.get('/items/:index/interested', async ctx => {
	try{
		const item = await new Item(dbName)

		await item.addInterestedUser(ctx.params.index, ctx.session.userID)

		await ctx.redirect(`/items/${ctx.params.index}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The page to handle users removing interest.
 *
 * @name Uninterested Page
 * @route {GET} /items/:index/uninterested
 */
router.get('/items/:index/uninterested', async ctx => {
	try{
		const item = await new Item(dbName)

		await item.removeInterestedUser(ctx.params.index, ctx.session.userID)

		await ctx.redirect(`/items/${ctx.params.index}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/items/:index/paypal', async ctx => {
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const item = await new Item(dbName)
		const user = await new User(dbName)

		//Getting information on items from items DB
		const itemData = await item.getDetails(ctx.params.index)
		const sellerData = await user.getDetails(itemData[0].userID)
		const buyerData = await user.getDetails(ctx.session.userID)
		//getting the images for the item
		const images = await item.getImages(itemData)

		await ctx.render('items', {image: images, item: itemData, user: userData, interested: interested, numberOfInterested: numberOfInterested})


		await ctx.render(`paypal`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/items/:index/email', koaBody, async ctx => {
	try {

		const body = ctx.request.body

		await ctx.redirect('/gallery')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The page to display user information.
 *
 * @name User Page
 * @route {GET} /user/:index
 * @authentication This route requires cookie-based authentication.
 */
router.get('/user/:index', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')

		const item = await new Item(dbName)
		const user = await new User(dbName)

		const userData = await user.getDetails(ctx.params.index)
		const userItem = await item.getUsersItems(ctx.params.index)

		const userNumberInterest = await item.userNumberInterest(ctx.params.index)

		await ctx.render('user', {user: userData, item: userItem, userNumberInterest: userNumberInterest})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The page to write a GDPR email.
 *
 * @name Email Page
 * @route {GET} /items/:index/email
 * @authentication This route requires cookie-based authentication.
 */
router.get('/items/:index/email', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')

		await ctx.render('email', {item: ctx.params.index})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process emails.
 *
 * @name Email Script
 * @route {POST} /items/:index/email
 */
router.post('/items/:index/email', koaBody, async ctx => {
	try {

		const body = ctx.request.body

		// get data from owner and interested user
		const item = await new Item(dbName)
		const user = await new User(dbName)

		const ownerID = await item.getUserIDFromItemID(ctx.params.index)	//Get the user ID from the item ID
		const interestedUser = await user.getDetails(ctx.session.userID)	//return all detials on the given user from the ID
		const ownerDetails = await user.getDetails(ownerID)

		const itemDetails = await item.getDetails(ctx.params.index)

		// owner can't email themselves
		await item.sendEmail(itemDetails, ownerDetails, interestedUser, body.subject, body.body, body.offer)

		await ctx.redirect('/gallery')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


//setting up release
app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
