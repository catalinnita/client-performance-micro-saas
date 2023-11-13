import lighthouse from "lighthouse"
import puppeteer from "puppeteer"
const chromeLauncher = require("chrome-launcher");
import { Options } from "chrome-launcher"
import reportGenerator from "lighthouse/report/generator/report-generator"
import request from "request"
import util from "util"
import config from "./lighthouseConfig"

export const generateLighthouseReport = async (url: string) => {
    const options = {
        logLevel: "info",
        disableDeviceEmulation: true,
        chromeFlags: [
            '--disable-mobile-emulation',
        ],
        onlyCategories: ['performance'],
    } as Options

    const chrome = await chromeLauncher.launch(options);
    options.port = chrome.port

    // Connect chrome-launcher to puppeteer
    const resp = await util.promisify(request)({url: `http://localhost:${options.port}/json/version`})
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl })

    // Run Lighthouse
    const { lhr } = await lighthouse(url, options, config)
    browser.disconnect()
    await chrome.kill()

    const { audits } = JSON.parse(reportGenerator.generateReport(lhr, 'json'))
    return audits
}