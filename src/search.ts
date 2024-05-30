import cities from "./data/cities.json";
import diets from "./data/diets.json";
import brands from "./data/brands.json";
import dishes from "./data/dishes.json";
import { SKIP_WORDS } from "./constants";

import { pool } from "./db";

type Entity = {
  id: string;
  name: string;
};

type EntityType = {
  [key: string]: Entity;
};

export async function extractEntities(originalSearchTerm: string) {
  const searchTerm = originalSearchTerm
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\s\w]/g, "");

  const chunks = searchTerm.split(" ");

  if (!chunks.length) return;

  const skipTypes = [] as string[];

  const types = {
    city: cities as Entity[],
    diet: diets as Entity[],
    brand: brands as Entity[],
    dishType: dishes as Entity[],
  };

  const result = chunks.reduce<EntityType[]>((entities, word, i) => {
    const nextWord = chunks[i + 1];
    const haveEntities = entities.length > 0;

    let newEntities = [] as EntityType[];

    if (SKIP_WORDS.includes(word)) return entities;

    Object.entries(types).some(([typeName, typeValues]) => {
      if (skipTypes.includes(typeName)) return;

      const matchFn = ({ name }: Entity) =>
        name
          .replace(/[^\s\w]/g, "")
          .toLowerCase()
          .includes(word);

      if (haveEntities) {
        const match = typeValues.find(matchFn);

        if (match) {
          newEntities = entities.map((entity) => ({
            ...entity,
            [typeName]: match,
          }));

          if (nextWord && nextWord !== "or") {
            skipTypes.push(typeName);
          }
        } else {
          newEntities = entities;
        }

        return !!match;
      } else {
        const matches = typeValues.filter(matchFn);

        if (matches.length) {
          newEntities = matches.map((match) => ({
            [typeName]: match,
          }));

          if (nextWord && nextWord !== "or") {
            skipTypes.push(typeName);
          }
        } else {
          newEntities = entities;
        }

        return !!matches.length;
      }
    });

    return newEntities;
  }, []);

  // const foundCities = cities.filter(({ name }) =>
  //   name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  console.log("RESULTS FOR:", originalSearchTerm);
  console.table(result);

  // const query = `SELECT * FROM entities WHERE "name" IN (${chunks
  //   .map((c) => `'${c.replace(/\'/g, `''`)}'`)
  //   .join(", ")}) ORDER BY "id" ASC`;

  // console.log("query", query);

  // pool.query(query).then((res) => {
  //   console.log("res", res.rows);
  // });

  return result;
}
