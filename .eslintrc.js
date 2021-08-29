module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        node: true
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'no-extra-boolean-cast': 0,
        'prefer-const': 0,
        'no-prototype-builtins': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
    }
  };