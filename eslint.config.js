import unjs from 'eslint-config-unjs'

export default unjs({
  ignores: ['dist', 'node_modules', 'playground/web'],
  rules: {
    'unicorn/no-anonymous-default-export': 0,
    'unicorn/no-null': 0,
  },
})
