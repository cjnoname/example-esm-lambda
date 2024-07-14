import "reflect-metadata";

const bb = async () => {
  return "asdsadasda";
};

// !!!! if comment it out, then the build can work well with AWS Lambda
// !!!! if uncomment it, then the build cannot work AWS Lambda,
//      as the "handler" function could not be found.
// console.log(await bb());

console.log("AAA:", process.env.AAA);
console.log(123);

export const handler = async () => {
  console.log(555);
  console.log(111, await bb());
};
