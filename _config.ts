import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import postcss from "lume/plugins/postcss.ts";
import simpleIcons from "https://deno.land/x/lume_icon_plugins@v0.2.4/simpleicons.ts";

const site = lume({
	src: "./src",
	dest: "./public"
});

site.use(jsx());
site.use(postcss());
site.add("styles.css");
site.copy([".jpg", ".svg"]);
site.use(simpleIcons());

export default site;