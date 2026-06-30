import eox from "@eox/eslint-config";

export default [
  {
    ignores: [
      "dist/**",
      "**/*.ipynb",
      "**/.venv/**",
      "**/.ipynb_checkpoints/**",
    ],
  },
  ...eox,
  {
    // Exercise starters intentionally leave provided helpers and layer skeletons
    // unused until the participant wires them up — keep that a warning, not an error.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Keep the JSDoc *type* rules (we annotate types), but drop the ones that
      // demand prose descriptions — those just add noise to self-explanatory code.
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/require-property-description": "off",
    },
  },
  {
    // Numbered starter scaffolds (not the solution/ versions): participants wire up
    // the declared elements and helpers, so "unused" is expected until they do.
    files: ["[0-9][0-9]-*/main.js"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
];
