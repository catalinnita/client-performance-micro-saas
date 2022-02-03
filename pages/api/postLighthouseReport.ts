import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateLighthouseReport } from '../../utils/generateLighthouseReport'

type Data = {
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body } = req;
  const { url, times, name } = JSON.parse(body)

  const urls = url.split("\n")
  const names = name.split("\n")

  // run lighthouse for the url
  for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
    for (let index = 1; index <= times; index++) {
      const report = await generateLighthouseReport(urls[urlIndex].toString())
      const date = new Date().getTime().toString();
      const filename = `${names[urlIndex]}-${date}~${index}.json`
      const data = JSON.stringify(report)
      fs.writeFileSync(`./public/tests/${filename}`, data)
    }
  }

  res.status(200).json({})
}
