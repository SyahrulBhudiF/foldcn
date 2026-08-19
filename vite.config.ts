import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    ignorePatterns: ['.turbo/**', 'dist/**', '**/*.d.ts'],
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  },
  lint: {
    ignorePatterns: ['.turbo/**', 'dist/**', '**/*.d.ts'],
    options: {
      typeAware: true,
    },
    plugins: ['typescript'],
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
    },
  },
})
