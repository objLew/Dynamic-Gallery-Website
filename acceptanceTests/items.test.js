'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')
const shell = require('shelljs')

const width = 800
const height = 600
const delayMS = 5

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	browser = await puppeteer.launch({ headless: true, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
	await shell.exec('acceptanceTests/scripts/beforeAll.sh')
})

afterAll( async() => {
	browser.close()
	await shell.exec('acceptanceTests/scripts/afterAll.sh')
})

beforeEach(async() => {
	await shell.exec('acceptanceTests/scripts/beforeEach.sh')
})

describe('Editing the title', () => {
	test('Changing the title', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		//ACT
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=paypal]', 'paypalname')
		await page.type('input[name=email]', 'NewUser@gmail.com')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/addItem', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=title]', 'title test')
		await page.type('input[name=price]', '1')
		await page.type('input[name=shortDesc]', 'short desc')
		await page.type('input[name=longDesc]', 'a bigger desc')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/items/1/edit', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=title]', 'edited title')
		await page.click('input[type=submit]')

		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('div[class=title]')
		expect( await page.evaluate( () => document.querySelector('div[class=title]').innerText ) )
			.toBe('edited title')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('Show Interest', () => {
	test('Showing the interest on an item', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		//ACT
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=paypal]', 'paypalname')
		await page.type('input[name=email]', 'NewUser@gmail.com')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]') 

		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/addItem', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=title]', 'title test')
		await page.type('input[name=price]', '1')
		await page.type('input[name=shortDesc]', 'short desc')
		await page.type('input[name=longDesc]', 'a bigger desc')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/items/1', { timeout: 30000, waitUntil: 'load' })
		await page.click('button[type=submit]')

		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('button[value=removeInterest]')
		expect( await page.evaluate( () => document.querySelector('button[value=removeInterest]').innerText ) )
			.toBe('remove interest')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('Remove Interest', () => {
	test('Removing the interest from an item', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		//ACT
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=paypal]', 'paypalname')
		await page.type('input[name=email]', 'NewUser@gmail.com')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]') 

		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/addItem', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=title]', 'title test')
		await page.type('input[name=price]', '1')
		await page.type('input[name=shortDesc]', 'short desc')
		await page.type('input[name=longDesc]', 'a bigger desc')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/items/1', { timeout: 30000, waitUntil: 'load' })
		await page.click('button[type=submit]')
		await page.click('button[type=submit]')

		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('button[value=showInterest]')
		expect( await page.evaluate( () => document.querySelector('button[value=showInterest]').innerText ) )
			.toBe('show interest')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('Buying Item', () => {
	test('Buying an item', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		//ACT
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=paypal]', 'paypalname')
		await page.type('input[name=email]', 'NewUser@gmail.com')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]') 

		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/addItem', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=title]', 'title test')
		await page.type('input[name=price]', '1')
		await page.type('input[name=shortDesc]', 'short desc')
		await page.type('input[name=longDesc]', 'a bigger desc')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/items/1', { timeout: 30000, waitUntil: 'load' })
		await page.click('a[name=buy]')
		await page.click('input[type=submit]')

		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('p[class=msg]')
		expect( await page.evaluate( () => document.querySelector('p[class=msg]').innerText ) )
			.toBe('thank you for your purchase of item number: 1, title test')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('Delete Item', () => {
	test('Deleting an item', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		//ACT
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=paypal]', 'paypalname')
		await page.type('input[name=email]', 'NewUser@gmail.com')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]') 

		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/addItem', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=title]', 'title test')
		await page.type('input[name=price]', '1')
		await page.type('input[name=shortDesc]', 'short desc')
		await page.type('input[name=longDesc]', 'a bigger desc')
		await page.click('input[type=submit]')

		//buying the item
		await page.goto('http://localhost:8080/items/1', { timeout: 30000, waitUntil: 'load' })
		await page.click('a[name=buy]')
		await page.click('input[type=submit]')

		//deleting the item
		await page.goto('http://localhost:8080/items/1', { timeout: 30000, waitUntil: 'load' })
		await page.click('input[value=delete]')


		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('p[class=msg]')
		expect( await page.evaluate( () => document.querySelector('p[class=msg]').innerText ) )
			.toBe('item 1 deleted')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})
