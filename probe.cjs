const postcss = require("postcss");
const tw = require("@tailwindcss/postcss");
const { compile } = require("react-native-css/compiler");
const input = `@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" source(none);
@import "nativewind/theme";
@source inline("font-sans");
@theme { --font-sans: "Courier"; }`;
postcss([tw({ base: process.cwd() })])
  .process(input, { from: process.cwd() + "/probe.css" })
  .then(({ css }) => console.log(JSON.stringify(
    compile(css, {}).stylesheet().vr.filter(([n]) => n === "font-sans"))));
