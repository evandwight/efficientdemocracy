module.exports = {
  projects: [
    {
      displayName: "default-tests",
      testEnvironment: "node",
      testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
      transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
      },
      roots: [
        "<rootDir>/src"
      ],
      moduleDirectories: ['node_modules']
    }
  ]
}