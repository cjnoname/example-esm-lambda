import { GeneralOrphanedType } from "src/config/orphanedTypes.js";
import type { DataSource } from "typeorm";

export const globalMiddlewares = (dataSource: DataSource) => [];

export const scalarsMap = [];

export const orphanedTypes = [GeneralOrphanedType];
