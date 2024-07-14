import "reflect-metadata";
import { dbConnect } from "src/config/typeorm.js";

export const initialLambda = async () => {
  await dbConnect();
};
