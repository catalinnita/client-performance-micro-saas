import lighthouse from "lighthouse"
import puppeteer from "puppeteer"
const chromeLauncher = require("chrome-launcher");
import { Options } from "chrome-launcher"
import reportGenerator from "lighthouse/report/generator/report-generator"
import request from "request"
import util from "util"

export const generateLighthouseReport = async (url: string) => {
    const options = {
        logLevel: "info",
        disableDeviceEmulation: true,
        chromeFlags: ['--disable-mobile-emulation']
    } as Options
    console.log({chromeLauncher})
    const chrome = await chromeLauncher.launch(options);
    options.port = chrome.port;

    // Connect chrome-launcher to puppeteer
    const resp = await util.promisify(request)(`http://localhost:${options.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });

    // Run Lighthouse
    const { lhr } = await lighthouse(url, options, null);
    browser.disconnect();
    await chrome.kill();

    return reportGenerator.generateReport(lhr, 'json');
}