import http from "http";
import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";

import { extractEntities } from "./search";

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("*", async (req: Request, res: Response) => {
  const entities = await extractEntities(req.query.search as string);

  res.status(200).json({
    entities,
  });
});

const server = http.createServer(app);

// Support API querying too.
server.listen(port, async () => {
  console.log(`API started at http://localhost:${port}`);

  const entities = await extractEntities("McDonald's");
  await extractEntities("McDonald's in London");
  await extractEntities("vegan sushi in London");
  await extractEntities("Veg sushi");
  await extractEntities("McDonalds in London or Manchester");

  // console.log("entities", entities);
});
