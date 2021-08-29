module.exports = {
  projects: [
    {
      displayName: "default-tests",
      testEnvironment: "node",
      transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
      },
      roots: [
        "<rootDir>/src"
      ],
      moduleDirectories: ['node_modules', 'src']
    },
    {
      displayName: "serial-tests",
      testEnvironment: "node",
      runner: "jest-serial-runner2",
      testMatch: ["**/?(*.)+(serial-test).[jt]s?(x)"],
      transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
      },
      roots: [
        "<rootDir>/src"
      ],
      moduleDirectories: ['node_modules', 'src']
    }
  ]
}
// runner: "jest-serial-runner",