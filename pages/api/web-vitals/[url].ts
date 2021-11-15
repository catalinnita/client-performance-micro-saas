// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateLighthouseReport } from '../../../utils/generateLighthouseReport'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query: { url } } = req;

  // validate the url

  // run lighthouse for the url
  const report = await generateLighthouseReport(url.toString())


  res.status(200).json(report)
}
