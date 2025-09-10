import { marked } from "npm:marked";

export const title = "tim's neocities page";

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

// Define the cards that have content - this drives the navigation
export const cardContent = [
	{
		cardIndex: 0,
		slug: "linktree",
		component: "Linktree",
		props: { links },
	},
	{
		cardIndex: 1,
		slug: "progress",
		component: "ReadingProgress",
		props: {},
	},
	{
		cardIndex: 6,
		slug: "friends",
		component: "Friends",
		props: {},
	},
	{
		cardIndex: 22,
		slug: "about",
		component: null,
		props: {},
	},
];

// Make cardContent available to the client-side script
export const layout = "layout.tsx";

export default ({ comp }: Lume.Data) => {
	return (
		<div id="tarot-content">
			<script
				type="application/json"
				id="card-content-data"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(cardContent),
				}}
			/>

			{cardContent.map((card) => (
				<div
					key={card.cardIndex}
					id={`card-${card.cardIndex}`}
					className="card-content"
				>
					{card.component === "Linktree" && (
						<comp.Linktree {...card.props} />
					)}
					{card.component === "ReadingProgress" && (
						<comp.ReadingProgress {...card.props} />
					)}
					{card.component === "Friends" && <p>
					  Check out my friends on Neocities:<br></br>
					  <a href="https://emelee.neocities.org/">emelee</a><br></br>
						<a href="https://looueez.neocities.org/">looueez</a><br></br>
						<a href="https://halfbloom.neocities.org/">halfbloom</a>
					</p>}
					{card.component === null && <p>
					  Made with  <a href="https://deno.com/">Deno</a> &  <a href="https://lume.land/">Lume</a>.<br></br>
						Source code on <a href="https://tangled.sh/@timtinkers.online/neocities">Tangled</a>.<br></br>
						Major Arcana art by <a href="https://jcanabal.itch.io/major-arcana-pixel-art-free">jcanabal</a>.
					</p>}
				</div>
			))}
		</div>
	);
};
