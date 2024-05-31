import { Entity } from "../models/entity";

export type FormattedEntity = {
  [entityType: string]: Pick<Entity, "id" | "name"> & {
    index: number;
  };
};
