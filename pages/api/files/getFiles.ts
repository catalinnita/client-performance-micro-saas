import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  files: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const filesFolder = './public/tests/';
    const files = fs.readdirSync(filesFolder);

    res.status(200).json({ files });
}
