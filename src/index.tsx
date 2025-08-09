import { marked } from "npm:marked";

export const title = "timconspicuous";
export const header = {
	title: "timconspicuous",
	description: "",
	avatar: "/avatar.jpg",
};

export const links = [
	{
		type: "bluesky",
		text: "Bluesky",
		href: "https://bsky.app/profile/timconspicuous.neocities.org",
	},
	{
		type: "letterboxd",
		text: "Letterboxd",
		href: "https://letterboxd.com/timconspicuous",
	},
	{
		type: "bookwyrm",
		text: "📚 BookWyrm",
		href: "https://bookwyrm.social/user/timconspicuous",
	},
	{
		type: "lichess",
		text: "Lichess",
		href: "https://lichess.org/@/timconspicuous",
	},
	{
		type: "discord",
		text: "Discord",
		href: "https://discordapp.com/users/timconspicuous",
	},
	{
		type: "spotify",
		text: "Spotify",
		href: "https://open.spotify.com/user/iafsfv7j85qcxqhnygkl8xuds",
	},
	{
		type: "tumblr",
		text: "Tumblr",
		href: "https://www.tumblr.com/timconspicuous",
	},
];

export const footer = marked.parseInline(
	"Powered by [Lume](https://lume.land)",
);

// Layout to use for this page
export const layout = "layout.tsx";

export default ({ comp }: Lume.Data) => {
	return (
		<comp.Linktree links={links} />
	);
};
