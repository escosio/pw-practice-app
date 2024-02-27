import {test, expect} from '@playwright/test'

// test.beforeAll() //
test.beforeEach(async({page}) => {
	await page.goto('http://localhost:4200/')
	await page.getByText('Forms').click()
	await page.locator(':text("Form Layouts")').click()
})

test('the first test', async({page}) => {
	// await page.goto('http://localhost:4200/')
	// await page.getByText('Forms').click()
	// await page.getByText('Form Layouts').click()
	await page.locator(':text-is("Form Layouts")').click()
})

test('the second test', async ({page}) => {
	// await page.goto('http://localhost:4200/')
	// await page.getByText('Forms').click()
	await page.locator(':text-is("Datepicker")').click()
	// await page.getByText('Datepicker').click()
})

test('Locator syntax rules', async({page}) => {
	// by tag name
	page.locator('input')
	// by ID
	page.locator('#inputEmail')
	// by Class value
	page.locator('.shape-rectangle')
	// by attribute
	page.locator('[placeholder="Email"]')
	// by Class value full
	page.locator('[class="input-full-width size-medium status-basic shape-rectangle]')
	// combine different selectors
	page.locator('input[placeholder="Email"][nbinput]')
	// xpath bla bla
	page.locator('//*[@id="inputEmail1')
	// Search partial text
	page.locator(':text("Using")')
	// Search using exact text
	page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
	await page.locator(':text("Form Layouts")').click()
	await page.getByRole('textbox', {name: "Email"}).first().click()
	await page.getByRole('button', {name: "Sign in"}).first().click()

	// if has <label> tag
	await page.getByLabel('Email').first().click()

	// using placeholder value
	await page.getByPlaceholder('Jane Doe').click()

	// or by text like above
	await page.getByText('Using the Grid')

	// by test ID, resilient but not user facing
	await page.getByTestId('SignIn')

	// by Title prop
	await page.getByTitle('IoT Dashboard').click()
})

test('locating child elements', async({page}) => {
	// chaining
	await page.locator('nb-card nb-radio :text-s("Option 1")')
	await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")')

	await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

	// select by index
	await page.locator('nb-card').nth(3).getByRole('button').click()

})

test('using parent locators', async({page}) => {
	await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
})

test('Reusing locators', async({page}) => {
	const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
	const emailField = basicForm.getByRole('textbox', {name: "Email"})

	await emailField.fill('test@test.com') // type into the text field
	await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
	await basicForm.locator('nb-checkbox').click()
	await basicForm.getByRole('button').click()

	await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) => {
	// single text values
	const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
	const buttonText = await basicForm.locator('button').textContent()
	expect(buttonText).toEqual('Submit')

	// all text values
	const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
	expect(allRadioButtonsLabels).toContain('Option 1')

	// get input values
	const emailField = basicForm.getByRole('textbox', {name: "Email"})
	await emailField.fill('test@test.com')
	const emailValue = await emailField.inputValue()
	expect(emailValue).toEqual('test@test.com')

	const placeholder = await emailField.getAttribute('placeholder')
	expect(placeholder).toEqual('Email')
})

test('assertions', async({page}) => {
	const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
	// General assertions
	const value = 5
	expect(value).toEqual(5)

	const text = await basicFormButton.textContent()
	expect(text).toEqual("Submit")

	// Locator assertions
	await expect(basicFormButton).toHaveText('Submit')

	// Soft Assertions - to continue execution even tho the test is failed
	await expect.soft(basicFormButton).toHaveText('Submit5')  // note the soft method
	await basicFormButton.click()  // this will still be executed even tho previous step fails
})


test('alt waits', async({page}) => {
	const successButton = page.locator('.bg-success')
	// wait for response
	await page.waitForResponse('https://uitestingplayground.com/ajaxdata')

	await page.waitForLoadState('networkidle')
})

test('tooltips', async({page}) => {
	await page.getByText('Modal & Overlays').click()
	await page.getByText('Tooltip').click()

	const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
	await toolTipCard.getByRole('button', {name: "Top"}).hover()

	page.getByRole('tooltip')
	const tooltip = await page.locator('nb-tooltip').textContent()
	expect(tooltip).toEqual('This is a tooltip')
})