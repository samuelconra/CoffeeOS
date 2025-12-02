import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],

    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: react,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,

      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,

      ...reactHooks.configs.recommended.rules,

      "prettier/prettier": "error",

      "eol-last": ["error", "always"],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-var": "error",
      "prefer-const": "error",

      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      "react/prop-types": "off",
    },
  },
]);
