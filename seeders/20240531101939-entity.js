"use strict";

const cities = require("./data/cities.json");
const diets = require("./data/diets.json");
const brands = require("./data/brands.json");
const dishes = require("./data/dishes.json");

const { kebabCase } = require("lodash");

const entityTypes = {
  city: cities,
  diet: diets,
  brand: brands,
  dish: dishes,
};

const mockEntities = Object.entries(entityTypes).reduce(
  (acc, [type, entities]) => {
    const typeEntities = entities.map(({ id, ...entity }) => {
      const slug = kebabCase(entity.name);

      return {
        ...entity,
        type,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return [...acc, ...typeEntities];
  },
  []
);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Entities", mockEntities);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Entities", null, {});
  },
};
