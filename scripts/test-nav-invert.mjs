import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import fs from 'node:fs'

const URL = process.env.TEST_URL ?? 'http://localhost:5173'

function luminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForSelector('.home-nav-visual-shell .home-nav-blend')
await page.waitForTimeout(300)

const styles = await page.evaluate(() => {
  const shell = document.querySelector('.home-nav-visual-shell')
  const blend = document.querySelector('.home-nav-visual-shell .home-nav-blend')
  if (!shell || !blend) return null
  return {
    shellMixBlendMode: getComputedStyle(shell).mixBlendMode,
    color: getComputedStyle(blend).color,
  }
})

if (!styles || styles.shellMixBlendMode !== 'difference') {
  console.error('FAIL: shell mix-blend-mode is not difference', styles)
  process.exit(1)
}

const box = await page.locator('.home-nav-visual-shell .home-nav-blend').first().boundingBox()
if (!box) {
  console.error('FAIL: nav blend box not found')
  process.exit(1)
}

const sampleX = Math.round(box.x + box.width * 0.75)
const sampleY = Math.round(box.y + box.height / 2)

await page.screenshot({ path: 'scripts/nav-invert-test.png' })
const png = PNG.sync.read(fs.readFileSync('scripts/nav-invert-test.png'))
const idx = (sampleY * png.width + sampleX) << 2
const r = png.data[idx]
const g = png.data[idx + 1]
const b = png.data[idx + 2]
const lum = luminance(r, g, b)

console.log('Sample point:', { sampleX, sampleY, rgb: [r, g, b], luminance: lum.toFixed(3) })

if (lum > 0.65) {
  console.error('FAIL: nav text area is too light on intro (expected dark text on light background)')
  process.exit(1)
}

console.log('PASS: nav invert appears dark on light background at page top')

await page.evaluate(() => {
  document.querySelector('.home-scroll')?.scrollTo(0, 1200)
})
await page.waitForTimeout(400)

const darkBox = await page.locator('.home-nav-visual-shell .home-nav-blend').first().boundingBox()
if (darkBox) {
  const darkSampleX = Math.round(darkBox.x + darkBox.width * 0.5)
  const darkSampleY = Math.round(darkBox.y + darkBox.height / 2)
  await page.screenshot({ path: 'scripts/nav-invert-scrolled.png' })
  const darkPng = PNG.sync.read(fs.readFileSync('scripts/nav-invert-scrolled.png'))
  const darkIdx = (darkSampleY * darkPng.width + darkSampleX) << 2
  const dr = darkPng.data[darkIdx]
  const dg = darkPng.data[darkIdx + 1]
  const db = darkPng.data[darkIdx + 2]
  const darkLum = luminance(dr, dg, db)
  console.log('Scrolled sample:', { rgb: [dr, dg, db], luminance: darkLum.toFixed(3) })
  if (darkLum < 0.55) {
    console.error('FAIL: nav did not brighten enough over darker scrolled content')
    process.exit(1)
  }
}

console.log('PASS: nav invert responds over scrolled content')
await browser.close()
