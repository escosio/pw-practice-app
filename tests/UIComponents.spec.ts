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