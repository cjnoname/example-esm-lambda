import "reflect-metadata";

const bb = async () => {
  return "asdsadasda";
};

console.log(await bb());

console.log("AAA:", process.env.AAA);
console.log(123);

export const handler = async () => {
  console.log(555);
  console.log(111, await bb());
};
