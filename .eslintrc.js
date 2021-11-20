module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": ["error", { allow: ["log", "warn", "error"] }],
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"indent": ["error", "tab"],
		"prettier/prettier": [
			"warn", {
				useTabs: true,
        trailingComma: "none",
        endOfLine: "auto"
			}
		]
  },
};
