const getZones = () => ([
  createZone('core')
])

const getConfig = () => ({
  'parser':  '@typescript-eslint/parser',
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript'
  ],
  'plugins': [
    'import'
  ],
  'parserOptions':  {
    'ecmaVersion':  2018,
    'sourceType':  'module'
  },
  'rules':  {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'args': 'none' }],
    '@typescript-eslint/member-delimiter-style': ['warn', {
      'multiline': {
        'delimiter': 'none',
        'requireLast': false
      },
      'singleline': {
        'delimiter': 'comma',
        'requireLast': false
      }
    }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    "semi": "off",
    "@typescript-eslint/semi": ['warn', 'never'],
    'quotes': 'off',
    '@typescript-eslint/quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'import/no-restricted-paths': ['error', { 'zones': getZones() }]
  }
})

const createZone = (module, dependencies = []) => {
  return {
    'target': './lib/' + module,
    'from': './src',
    'except': (module === 'core')
      ? [ './core' ]
      : [ './' + module, './core', ...dependencies.map(dependency => './' + dependency) ]
  }
}

module.exports = getConfig()
