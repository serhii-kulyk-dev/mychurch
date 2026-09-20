import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    // Тека статичного експорту (distDir у next.config.ts).
    ".static/**",
    "build/**",
    /* Тимчасові копії репозиторію від Claude Code — не наш код. */
    ".claude/worktrees/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
