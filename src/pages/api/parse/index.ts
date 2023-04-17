import typer from "@/utils/typer";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  res.status(200).json(typer(body.data));
}
