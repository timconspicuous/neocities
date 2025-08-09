export default function Layout(data: Lume.Data) {
	const title = data.header?.title || data.title || "timconspicuous";
	const description = data.header?.description || data.description || "";
	const avatar = data.header?.avatar || "/avatar.jpg";
	const footer = data.footer || "";
	const links = data.links || [];

	return (
		<html lang={data.lang || "en"}>
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>{title}</title>
				<meta name="supported-color-schemes" content="light dark" />
				<meta
					name="theme-color"
					content="hsl(220, 20%, 100%)"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="hsl(220, 20%, 10%)"
					media="(prefers-color-scheme: dark)"
				/>
				<link rel="stylesheet" href="/styles.css" />
				<link rel="stylesheet" href="/components.css" />
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon.png"
				/>
				<link rel="canonical" href={data.url} />
				{data.extra_head?.map((item: string) => (
					<div dangerouslySetInnerHTML={{ __html: item }} />
				))}
			</head>
			<body>
				<main>
					<header class="header">
						<script
							dangerouslySetInnerHTML={{
								__html: `
				let theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches
				  ? "dark"
				  : "light");
				document.documentElement.dataset.theme = theme;
				function changeTheme() {
				  theme = theme === "dark" ? "light" : "dark";
				  localStorage.setItem("theme", theme);
				  document.documentElement.dataset.theme = theme;
				}
			  `,
							}}
						/>
						<button
							class="button header-theme"
							onclick="changeTheme()"
						>
							<span class="icon">◐</span>
						</button>
						{avatar && (
							<img
								class="header-avatar"
								src={avatar}
								alt="Avatar"
								data-lume-transform-images="webp avif 200@2"
							/>
						)}
						<h1 class="header-title">{title}</h1>
						{description && (
							<div
								dangerouslySetInnerHTML={{
									__html: description,
								}}
							/>
						)}
					</header>

					{data.children}
				</main>

				{footer && (
					<footer dangerouslySetInnerHTML={{ __html: footer }} />
				)}
			</body>
		</html>
	);
}
