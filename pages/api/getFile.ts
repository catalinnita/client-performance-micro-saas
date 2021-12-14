import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = Record<string, any>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { body } = req;
    const { file } = JSON.parse(body);

    const filesFolder = './public/tests/';
    const data = fs.readFileSync(`${filesFolder}${file}`);

    // process data

    res.status(200).json(data);
}
