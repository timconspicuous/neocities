import { marked } from "npm:marked";

export const title = "tim's neocities page";
export const header = {
	title: "timconspicuous",
	description: "",
	avatar: "/avatar.jpg",
};

export const links = [
	{
		type: "bluesky",
		text: "Bluesky",
		href: "https://bsky.app/profile/timtinkers.online",
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
	"Powered by [Lume](https://lume.land), [source code on Tangled](https://tangled.sh/@timtinkers.online/neocities)",
);

// Layout to use for this page
export const layout = "layout.tsx";

export default ({ comp }: Lume.Data) => {
	return (
		<div>
			<div
				id="reading-progress-widget"
				data-reading-progress="true"
				style={{
					padding: "1rem",
				}}
			>
			</div>
			<div>
				<comp.Linktree links={links} />
			</div>
		</div>
	);
};
