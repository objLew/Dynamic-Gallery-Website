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

const maxImages = 3


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

		//Getting information on items from items DB
		const sql = 'SELECT * FROM items;'
		const db = await Database.open(dbName)
		const data = await db.all(sql)
		await db.close()

		const auth = ctx.session.authorised
		//getting the interest for each item
		const dataSize = Object.keys(data).length
		for (let i = 0; i < dataSize; i++) {
			data[i].interest = await item.numberOfInterested(data[i].id)
		}

		await ctx.render('gallery', {data: data, auth: auth})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
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


router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})


router.get('/addItem', async ctx => {
	//if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
	await ctx.render('addItem')
	console.log(ctx.session.userID)
})

/**
 * The script to process new items added.
 *
 * @name addItem Script
 * @route {POST} /addItem
 */

router.post('/addItem', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)

		var {path, type} = ctx.request.files.pic1
		await fs.copy(path, `public/items/${body.title}1.png`)

		var {path, type} = ctx.request.files.pic2
		await fs.copy(path, `public/items/${body.title}2.png`)

		var {path, type} = ctx.request.files.pic3
		await fs.copy(path, `public/items/${body.title}3.png`)

		const item = await new Item(dbName)
		console.log(item)
		console.log(ctx.session.userID)

		await item.addItem(ctx.session.userID, body.title, body.price, body.shortDesc, body.longDesc)

		await ctx.redirect('/gallery')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process the currently clicked ite.
 *
 * @name items Script
 * @route {POST} /items
 */
router.get('/items/:index', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const item = await new Item(dbName)

		//Getting information on items from items DB
		const sqlItems = `SELECT * FROM items where id = "${ctx.params.index}"`
		const db = await Database.open(dbName)
		const itemData = await db.all(sqlItems)

		const userID = itemData[0].userID
		const sqlUser = `SELECT * FROM users where id = "${userID}"`
		const userData = await db.all(sqlUser)
		await db.close()
		//checking how many pictures the item has
		const images = []
		for(let i = 0; i < maxImages; i++) if(fs.existsSync(`public/items/${itemData[0].title}${i}.png`)) images.push(itemData[0].title+i)

		const interested = await item.isInterested(ctx.params.index, ctx.session.userID)
		const numberOfInterested = await item.numberOfInterested(ctx.params.index)
		await ctx.render('items', {image: images, item: itemData, user: userData, interested: interested, numberOfInterested: numberOfInterested})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/items/:index/email', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const item = await new Item(dbName)

		await ctx.render('email')

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/*
router.post('/items/:index', koaBody, async ctx => {
	try {

		console.log("user of interest added!")
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
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

router.get('/items/:index/uninterested', async ctx => {
	try{
		const item = await new Item(dbName)

		await item.removeInterestedUser(ctx.params.index, ctx.session.userID)

		await ctx.redirect(`/items/${ctx.params.index}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/user/:index', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')

		const item = await new Item(dbName)

		//Getting information on specified user from items DB
		const sqlUser = `SELECT * FROM users where id = "${ctx.params.index}"`
		const sqlItems = `SELECT * FROM items where userID = "${ctx.params.index}"`
		const db = await Database.open(dbName)
		const userData = await db.all(sqlUser)
		const userItem = await db.all(sqlItems)
		await db.close()

		const userNumberInterest = await item.userNumberInterest(ctx.params.index)

		await ctx.render('user', {user: userData, item: userItem, userNumberInterest: userNumberInterest})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/delete', async ctx => {
	try{
		const sql = 'DROP TABLE usersOfInterest'
		const db = await Database.open(dbName)
		await db.run(sql)
		await db.close()
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

//setting up release
app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))