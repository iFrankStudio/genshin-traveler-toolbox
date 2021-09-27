import { ElectronApplication, Page, _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import path from 'path'

async function initialiseApp() {
  return electron.launch({
    // executablePath: electronPath,
    args: [path.join(__dirname, '../dist')],
    env: {
      NODE_ENV: 'test'
    }
  })
}

async function takeScreenshot(
  page: Page,
  type = 'page',
  title: () => string = Date.now().toString
) {
  return page.screenshot({
    path: path.join(__dirname, `./screenshots/${type}-${await title()}.png`),
    // type: 'jpeg',
    omitBackground: false
  })
}

test.describe('Application launch', () => {
  test.setTimeout(60000)

  let app: ElectronApplication

  test.beforeAll(async () => {
    app = await initialiseApp()
  })

  test.afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  test('shows an initial window', async () => {
    const first = await app.firstWindow()

    // first.on('console', console.log)
    await takeScreenshot(first)
    // await app.close()
    // await app.waitForEvent('close')
  })
})
