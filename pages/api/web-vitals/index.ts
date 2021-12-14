import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateLighthouseReport } from '../../../utils/generateLighthouseReport'

type Data = {
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body } = req;
  const { url, times, name } = JSON.parse(body);

  // run lighthouse for the url
  for (let index = 1; index <= times; index++) {
    const report = await generateLighthouseReport(url.toString())
    const date = new Date().getTime().toString();
    const filename = `${name}-${date}~${index}.json`;
    const data = JSON.stringify(report);
    fs.writeFileSync(`./public/tests/${filename}`, data);
  }

  res.status(200).json({})
}
