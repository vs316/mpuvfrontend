import { getPreSignedUrl } from "../utils/s3";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key } = req.query;

  if (typeof key === "string") {
    const url = getPreSignedUrl("ceptrackerbucket", key);
    res.status(200).json({ url });
  } else {
    res.status(400).json({ error: "Invalid key parameter" });
  }
}
