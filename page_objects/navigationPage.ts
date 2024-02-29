import {Page} from '@playwright/test'

export class NavigationPage {

    readonly page: Page
    readonly formLayoutsMenuItem: Locator

    constructor(page: Page) {
        this.page = page
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
    }

    async formLayoutsPage() {
        // await this.page.getByText('Forms').click()
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
	    // await this.page.locator(':text("Form Layouts")').click()
    }
    
    // other methods i didnt do yet

    private async selectGroupMenuItem(groupMenuTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded') // found in the source
        if (expandedState == "false") {
            await groupMenuItem.click()
        }
    }

}