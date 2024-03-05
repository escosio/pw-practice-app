import {test, expect} from '@playwright/test'

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = Date()
    date.setDate(date.getDate() + 1)
    const expectedDate = date.getDate().toString()
    const expextedMonthShort = date.toLocalString('EN-US', {month: 'short'})
    const expextedMonthLong = date.toLocalString('EN-US', {month: 'short'})
    const expectedYear = date.getYear()
    const dateToAssert = `${expextedMonthShort} ${expectedDate}, ${expectedYear} `

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expextedMonthLong} ${expectedYear}`
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [date-name="chevron-right"]')
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    // update attribute
    const tempGauge = page.locator('[tabTitle="Temperature] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    // Mouse movement
    const tempBox = page.locator('[tabTitle="Temperature] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down() // clicks and holds
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})