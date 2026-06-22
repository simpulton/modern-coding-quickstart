import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/.next', '**/node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // Principle I — DDD layer dependency rules, enforced not just documented.
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: 'type:core-model', onlyDependOnLibsWithTags: ['type:shared'] },
            {
              sourceTag: 'type:core-application',
              onlyDependOnLibsWithTags: ['type:core-model', 'type:shared'],
            },
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: ['type:core-model', 'type:shared'],
            },
            {
              sourceTag: 'type:trpc',
              onlyDependOnLibsWithTags: [
                'type:core-application',
                'type:data',
                'type:core-model',
                'type:shared',
              ],
            },
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:trpc', 'type:shared'] },
            {
              sourceTag: 'type:infrastructure',
              onlyDependOnLibsWithTags: [
                'type:core-model',
                'type:core-application',
                'type:data',
                'type:shared',
              ],
            },
            { sourceTag: 'type:shared', onlyDependOnLibsWithTags: ['type:shared'] },
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['*'] },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Principle IV — Type Safety: no escape hatches.
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
