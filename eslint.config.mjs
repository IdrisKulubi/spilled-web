import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow any variable usage without restrictions
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      
      // Allow flexible imports and exports
      "@typescript-eslint/no-var-requires": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",
      
      // Allow console statements
      "no-console": "off",
      
      // Allow flexible React usage
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      
      // Allow flexible JavaScript patterns
      "no-undef": "off",
      "no-unused-vars": "off",
      "prefer-const": "warn",
      "no-var": "warn",
      
      // Next.js specific relaxations
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // Allow flexible spacing and formatting
      "no-multiple-empty-lines": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
      
      // Allow any naming conventions
      "@typescript-eslint/naming-convention": "off",
      "camelcase": "off",
    }
  }
];

export default eslintConfig;
