import { defineConfig } from 'vite-plus'

const agentIgnorePatterns = [
  '.agent/**',
  '.agents/**',
  '.claude/**',
  '.codex/**',
  '.continue/**',
  '.cursor/**',
  '.gemini/**',
  '.opencode/**',
  '.pi/**',
  '.roo/**',
  '.windsurf/**',
  'tools/oxlint/anti-slop/**',
]

export default defineConfig({
  fmt: {
    ignorePatterns: ['.turbo/**', 'dist/**', '**/*.d.ts', ...agentIgnorePatterns],
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  },
  lint: {
    ignorePatterns: ['.turbo/**', 'dist/**', '**/*.d.ts', ...agentIgnorePatterns],
    options: {
      typeAware: true,
    },
    plugins: ['typescript'],
    jsPlugins: [
      { name: 'anti-slop', specifier: './tools/oxlint/anti-slop/index.ts' },
      {
        name: 'anti-slop-effect',
        specifier: './tools/oxlint/anti-slop/effect/index.ts',
      },
    ],
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'typescript/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'typescript/no-explicit-any': 'error',
      'anti-slop/no-chained-type-assertions': 'error',
      'anti-slop/no-conditional-empty-object-spread': 'error',
      'anti-slop/no-known-value-widening': 'error',
      'anti-slop/no-module-mocking': 'error',
      'anti-slop/no-object-parameters': 'error',
      'anti-slop/no-reflect-apply': 'error',
      'anti-slop/no-reflect-get': 'error',
      'anti-slop/no-runtime-typeof': ['error', { allowInTypeGuards: true }],
      'anti-slop/no-shape-in-symbol-names': 'error',
      'anti-slop/no-unknown-parameters': 'error',
      'anti-slop/no-unknown-returns': 'error',
      'anti-slop/no-unknown-type-aliases': 'error',
      'anti-slop/no-unsafe-dictionary-type': 'error',
      'anti-slop/no-widen-then-assert': 'error',
      'anti-slop/require-safety-comment-for-type-assertion': 'error',
      'anti-slop-effect/no-service-constructor-imports': 'error',
    },
  },
})
