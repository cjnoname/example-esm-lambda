module.exports = {
  displayName: "api",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$",
  moduleFileExtensions: ["ts", "js", "json"],
  modulePathIgnorePatterns: ["/testUtils/.*", "/testData/.*"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1"
  }
};
