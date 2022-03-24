module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      spacing: {
        72: "18rem",
        84: "21rem",
        50: "50rem",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  // corePlugins: {
  //   preflight: false,
  // },
};
