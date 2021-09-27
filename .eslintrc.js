/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  globals: {
    __static: true,
    __windowUrls: true,
    __preloads: true,
    __workers: true,
    NodeJS: true
  },
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: ".*", args: "none" }],
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  ignorePatterns: ["node_modules/**", "dist/**"]
};
