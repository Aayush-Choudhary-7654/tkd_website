import { globalIgnores } from "eslint/config";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "import/prefer-default-export": "off",
    "react-refresh/only-export-components": "off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-console": "warn",
    "prefer-arrow-callback": "off"
    }
  }
];

export default eslintConfig;
