import Button from "./Button.tsx";

export default function ({ links }: {
	links: Array<{
		type: string;
		text: string;
		href: string;
		hex?: string;
		textColor?: string;
		only_icon?: boolean;
	}>;
}, { comp }: { comp: Lume.Data }) {
	const iconLinks = links.filter((link) => link.only_icon);
	const regularLinks = links.filter((link) => !link.only_icon);

	return (
		<>
			{iconLinks.length > 0 && (
				<ul class="icon-list">
					{iconLinks.map((link) => (
						<li key={link.href}>
							<Button link={link} />
						</li>
					))}
				</ul>
			)}

			<ul class="link-list">
				{regularLinks.map((link) => (
					<li key={link.href}>
						<Button link={link} />
					</li>
				))}
			</ul>
		</>
	);
}
