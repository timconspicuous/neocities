export default function Layout(data: Lume.Data) {
	return (
		<html lang={data.lang || "en"}>
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>timconspicuous</title>
				<meta name="supported-color-schemes" content="light dark" />
				<link rel="stylesheet" href="/styles.css" />
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon.svg"
				/>
				<link rel="canonical" href={data.url} />
			</head>
			<body>
				<div id="tarot-app">
					<main class="tarot-layout">
						<div id="card-container" class="card-container">
							<div class="tarot-card">
								<img
									id="card-image"
									class="card-image"
									src="/images/tarot/0-the-fool.png"
									alt="The Fool"
								/>
							</div>
						</div>

						<div id="content-container" class="content-container">
							<div id="content-wrapper" class="content-wrapper">
								<div id="content-title" class="content-title">
								</div>
								{data.children}
							</div>
						</div>
					</main>

					<nav class="tarot-navigation">
						<button
							type="button"
							id="prev-card"
							class="nav-button nav-prev"
							aria-label="Previous card"
						>
							<span class="nav-arrow">←</span>
						</button>
						<div id="card-indicator" class="card-indicator">
							<span id="current-card">0</span>
						</div>
						<button
							type="button"
							id="next-card"
							class="nav-button nav-next"
							aria-label="Next card"
						>
							<span class="nav-arrow">→</span>
						</button>
					</nav>
				</div>

				<script src="/scripts/tarot.js"></script>
			</body>
		</html>
	);
}
