import { dirname } from "path";
import { fileURLToPath } from "url";
import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "typescript-eslint";

//================================================

const fixedReactHooksPlugin = fixupPluginRules(eslintPluginReactHooks);

const baseConfig = {
  name: "eslint",
  extends: [eslintJs.configs.recommended],
  files: ["**/*.ts", "**/*.tsx"],
};

const tslintConfig = {
  name: "typescript",
  extends: [...typescriptEslint.configs.recommendedTypeChecked],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        modules: true,
      },
      ecmaVersion: "latest",
      project: "./tsconfig.json",
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: "error",
  },

  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/consistent-type-imports": "error",
  },
};

const importConfig = {
  plugins: ["import"],
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/no-anonymous-default-export": "off",
        "import/no-unresolved": "error",
        "import/no-duplicates": "error",
        "import/order": [
          "error",
          {
            "newlines-between": "always",
            groups: [
              ["builtin", "external"],
              ["internal", "parent", "sibling", "index", "object"],
              "unknown",
              "type",
            ],
            distinctGroup: false,
            pathGroupsExcludedImportTypes: ["type"],
          },
        ],
      },
    },
  ],
  ignorePatterns: ["dist/**/*", "**/*.html", "**/*.min.js"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json"],
        alwaysTryTypes: true,
      },
    },
  },
};

const reactConfig = {
  name: "react",
  extends: [eslintPluginReact.configs.flat["jsx-runtime"]],
  plugins: {
    "react-hooks": fixedReactHooksPlugin,
  },
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    "react-hooks/exhaustive-deps": "error",
    ...fixedReactHooksPlugin.configs.recommended.rules,
  },
};

const a11yConfig = {
  name: "jsxA11y",
  ...jsxA11yPlugin.flatConfigs.recommended,
  plugins: {
    "jsx-a11y": jsxA11yPlugin,
  },
  rules: {
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
  },
};

//================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const overridesCompat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: typescriptEslint.configs.recommendedTypeChecked,
});

export default typescriptEslint
  .config(
    baseConfig,
    tslintConfig,
    eslintConfigPrettier,
    overridesCompat.config(importConfig),
    reactConfig,
    a11yConfig
  )
  .map(config => ({
    ...config,
    ignores: [...(config.ignores ?? []), "tsup.config.ts"],
  }));
