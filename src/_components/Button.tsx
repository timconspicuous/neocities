import * as si from "npm:simple-icons@13.10.0";
import type { SimpleIcon } from "npm:simple-icons@13.10.0";

export default function ({
	link,
}: {
	link: {
		type: string;
		text: string;
		href: string;
		hex?: string;
		textColor?: string;
		only_icon?: boolean;
	};
}) {
	// Get the icon information directly from simple-icons
	const icons = Object.values(si) as SimpleIcon[];
	const icon = icons.find((icon) => icon.slug === link.type);

	// Use the specified hex or get it from the icon (or default to white)
	const hex = link.hex || (icon ? `#${icon.hex}` : "#fff");

	// Function to determine text color based on background color brightness
	const getTextColor = (backgroundColor: string) => {
		// Remove the # if present and pad to 6 characters if needed
		const color =
			(backgroundColor.startsWith("#")
				? backgroundColor.slice(1)
				: backgroundColor).padEnd(
					6,
					backgroundColor.length <= 4
						? backgroundColor.slice(-1)
						: "",
				);

		// Convert hex to RGB
		const r = parseInt(color.substring(0, 2), 16);
		const g = parseInt(color.substring(2, 4), 16);
		const b = parseInt(color.substring(4, 6), 16);

		// Calculate luminance to determine perceived brightness
		const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

		// Return black for light backgrounds, white for dark ones
		return luminance > 128 ? "#000000" : "#ffffff";
	};

	const textColor = link.textColor || getTextColor(hex);

	return (
		<a
			href={link.href}
			class="button"
			style={`--bg-color:${hex}; --text-color:${textColor}`}
			title={link.only_icon ? link.text : undefined}
			dangerouslySetInnerHTML={{
				__html: `${icon ? icon.svg : ""}${
					!link.only_icon ? link.text : ""
				}`,
			}}
		/>
	);
}
