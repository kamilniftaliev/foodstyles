import { Op } from "sequelize";
import { kebabCase } from "lodash";

import { SKIP_WORDS } from "./constants";
import { Entity } from "../models/entity";
import { FormattedEntity } from "./types";

export async function extractEntities(originalSearchTerm: string) {
  const searchTerm = kebabCase(originalSearchTerm);

  const keywords = searchTerm.split("-");

  // If nothing to look for, do nothing
  if (!keywords.length) return;

  const usableKeywords = keywords.filter(
    (keyword) => !SKIP_WORDS.includes(keyword)
  );

  // Find entities that match the 1 of the keywords
  const entities = await Entity.findAll({
    where: {
      [Op.or]: usableKeywords.map((keyword) => ({
        slug: {
          [Op.like]: `%${keyword}%`,
        },
      })),
    },
  });

  const result = entities.reduce((previousEntities, entity, i) => {
    const combinations = [] as FormattedEntity[];

    const matchingKeyword = keywords.find((keyword) =>
      entity.slug.includes(keyword)
    );

    if (!matchingKeyword) return previousEntities;

    // Start by creating a new combination from
    // the first matching entity. And later, we'll
    // add more types to this combination
    combinations.push({
      [entity.type]: {
        name: entity.name,
        id: entity.id,
        index: i,
      },
    });

    // As was requested by Cristian, for each word,
    // we have to go through all words again
    keywords.forEach((keyword, i) => {
      // Don't search for anything if the keyword is "in" or "or"
      if (SKIP_WORDS.includes(keyword) || keyword === matchingKeyword) return;

      // If the previous keyword is "or", then we should accept
      // a new combination with the same entity type
      const acceptSameType = keywords[i - 1] === "or";

      entities.some((entity, index) => {
        const existingTypes = Object.keys(combinations[0]);
        const alreadyHaveThisType = existingTypes.includes(entity.type);
        const entityMatches = entity.slug.includes(keyword);

        const matches =
          (acceptSameType || !alreadyHaveThisType) && entityMatches;

        if (!matches) return;

        // If "or" was used before this keyword, then
        // we create a new combination and add it to the array
        if (acceptSameType) {
          combinations.push({
            ...combinations[0],
            [entity.type]: {
              ...entity.dataValues,
              index,
            },
          });
        } else {
          combinations[0][entity.type] = {
            ...entity.dataValues,
            index,
          };
        }

        return true;
      });
    });

    // Ignore the new combinations that already exist in the list of previous combinations
    const uniqueCombinations = combinations.reduce(
      (prevUniqueCombinations, combination) => {
        // Since all entities have a unique index as an identificator,
        // we can identify a combination by the entities that were used in it.
        // There can't be any duplicates because of that, because the indices
        // are sorted before stringifying them.
        const id = Object.values(combination)
          .map(({ index }) => index)
          .sort()
          .join("");

        const isNewCombination = id && !previousEntities[id];

        // If we haven't used all of this entities in this combination together, add it to the list.
        if (isNewCombination) {
          return {
            [id]: combination,
            ...prevUniqueCombinations,
          };
        }

        return prevUniqueCombinations;
      },
      {} as { [id: string]: FormattedEntity }
    );

    return {
      ...uniqueCombinations,
      ...previousEntities,
    };
  }, {} as { [id: string]: FormattedEntity });

  // Format the output
  const cleanEntities = Object.values(result).map((combination) =>
    Object.entries(combination).reduce(
      (acc, [type, { id, name }]) => ({
        ...acc,
        [type]: {
          id,
          name,
        },
      }),
      {}
    )
  );

  console.clear();
  console.log("RESULTS FOR:", originalSearchTerm);
  console.log(cleanEntities);

  return cleanEntities;
}
