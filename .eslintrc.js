module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['standard', 'prettier'],
    plugins: ['@typescript-eslint/eslint-plugin'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
    },
};
