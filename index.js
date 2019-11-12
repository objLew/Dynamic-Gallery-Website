#!/usr/bin/env node

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

let currentUserID = 1;

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
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		//const data = {}
		//if(ctx.query.msg) data.msg = ctx.query.msg

		console.log('/')
		const sql = 'SELECT user FROM users;'
		const db = await Database.open(dbName)
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('gallery', {user: data})

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process new user registrations.
 *
 * @name Gallery Script
 * @route {POST} /gallery
 */
router.post('/gallery', koaBody, async ctx => {
	//implement post
})

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
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
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

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		
		
		//Getting userID from username
		const sql = `SELECT id FROM users WHERE user = "${body.user}"`
		const db = await Database.open(dbName)
		const data = await db.all(sql)
		ctx.session.userID = data;

		//console.log(currentUserID)

		return await ctx.redirect('gallery')
		//return ctx.redirect('/?msg=you are now logged in...')
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
})

router.post('/addItem', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		const item = await new Item(dbName);
		console.log(item);

		/*
		if(body == undefined||Object.keys(body).length <= 0){
			throw new Error('Whatcha doing');
		}
		*/
		
		await item.addItem(ctx.session.userID, body.title, body.price, body.shortDesc, body.longDesc)

		await ctx.redirect('/gallery')	
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})



app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
