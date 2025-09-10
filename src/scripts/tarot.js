class Tarot {
	constructor() {
		this.currentCardIndex = 0;
		this.isTransitioning = false;
		this.isFirstLoad = true;

		// Full Major Arcana + back card data
		this.allCardData = [
			{ id: "0", name: "The Fool" },
			{ id: "I", name: "The Magician" },
			{ id: "II", name: "The High Priestess" },
			{ id: "III", name: "The Empress" },
			{ id: "IV", name: "The Emperor" },
			{ id: "V", name: "The Hierophant" },
			{ id: "VI", name: "The Lovers" },
			{ id: "VII", name: "The Chariot" },
			{ id: "VIII", name: "Strength" },
			{ id: "IX", name: "The Hermit" },
			{ id: "X", name: "Wheel of Fortune" },
			{ id: "XI", name: "Justice" },
			{ id: "XII", name: "The Hanged Man" },
			{ id: "XIII", name: "Death" },
			{ id: "XIV", name: "Temperance" },
			{ id: "XV", name: "The Devil" },
			{ id: "XVI", name: "The Tower" },
			{ id: "XVII", name: "The Star" },
			{ id: "XVIII", name: "The Moon" },
			{ id: "XIX", name: "The Sun" },
			{ id: "XX", name: "Judgement" },
			{ id: "XXI", name: "The World" },

			{ id: "back", name: "Return" },
		];

		// Available cards (loaded from page data)
		this.availableCards = [];
		this.loadAvailableCards();

		this.init();
	}

	loadAvailableCards() {
		const cardContentData = document.getElementById("card-content-data");
		if (!cardContentData) {
			console.error("Card content data not found");
			return;
		}

		try {
			const cardContent = JSON.parse(cardContentData.textContent);

			// Map card content to available cards with full data
			this.availableCards = cardContent.map((card) => {
				const tarotCard = this.allCardData[card.cardIndex] || {
					id: card.cardIndex.toString(),
					name: "Unknown Card",
				};

				return {
					...tarotCard,
					cardIndex: card.cardIndex,
					slug: card.slug,
					component: card.component,
				};
			});

			console.log("Available cards:", this.availableCards);
		} catch (error) {
			console.error("Error parsing card content data:", error);
		}
	}

	init() {
		this.setupEventListeners();
		this.setupTouchEvents();
		this.loadFromHash();
		this.updateImage();
		this.updateCardIndicator();
		this.loadComponent();

		// Initial fade-in only on first load
		if (this.isFirstLoad) {
			this.initialFadeIn();
		}
	}

	initialFadeIn() {
		const contentContainer = document.getElementById("content-container");
		const cardContainer = document.getElementById("card-container");

		// Start both containers as invisible
		if (contentContainer) {
			contentContainer.style.opacity = "0";
			contentContainer.style.transform = "translate(100px, -50%)";
		}
		if (cardContainer) {
			cardContainer.style.opacity = "0";
			cardContainer.style.transform = "translate(-100px, -50%)";
		}

		// Fade in after a short delay
		setTimeout(() => {
			if (contentContainer) {
				contentContainer.style.transition = "opacity 0.8s ease-in-out";
				contentContainer.style.opacity = "1";
			}
			if (cardContainer) {
				cardContainer.style.transition = "opacity 0.8s ease-in-out";
				cardContainer.style.opacity = "1";
			}
		}, 100);

		this.isFirstLoad = false;
	}

	setupEventListeners() {
		// Navigation buttons
		document.getElementById("prev-card")?.addEventListener(
			"click",
			() => this.previousCard(),
		);
		document.getElementById("next-card")?.addEventListener(
			"click",
			() => this.nextCard(),
		);

		// Make card indicator clickable to return to first card (card 0)
		document.getElementById("card-indicator")?.addEventListener(
			"click",
			() => this.goToFirstCard(),
		);

		// Keyboard navigation
		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				this.previousCard();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				this.nextCard();
			} else if (e.key === "Home") {
				e.preventDefault();
				this.goToFirstCard();
			}
		});

		// Hash change listener
		globalThis.addEventListener("hashchange", () => this.loadFromHash());
	}

	setupTouchEvents() {
		let startX = 0;
		let startY = 0;

		document.addEventListener("touchstart", (e) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		});

		document.addEventListener("touchend", (e) => {
			if (!startX || !startY) return;

			const endX = e.changedTouches[0].clientX;
			const endY = e.changedTouches[0].clientY;

			const diffX = startX - endX;
			const diffY = startY - endY;

			// Only trigger if horizontal swipe is dominant
			if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
				if (diffX > 0) {
					this.nextCard();
				} else {
					this.previousCard();
				}
			}

			startX = 0;
			startY = 0;
		});
	}

	loadFromHash() {
		const hash = globalThis.location.hash.slice(1);
		if (!hash) {
			this.currentCardIndex = 0;
			this.updateHash();
			return;
		}

		// Try to find by card ID first, then by slug
		let foundIndex = this.availableCards.findIndex((card) =>
			card.id === hash || card.slug === hash
		);

		// If not found, try parsing as card index
		if (foundIndex === -1) {
			const cardIndex = parseInt(hash);
			if (!isNaN(cardIndex)) {
				foundIndex = this.availableCards.findIndex((card) =>
					card.cardIndex === cardIndex
				);
			}
		}

		if (foundIndex !== -1) {
			this.currentCardIndex = foundIndex;
		} else {
			// Default to first card if hash doesn't match anything
			this.currentCardIndex = 0;
		}

		this.updateImage();
		this.updateCardIndicator();
	}

	updateHash() {
		const currentCard = this.availableCards[this.currentCardIndex];
		if (currentCard) {
			// Prefer slug over card ID for URL
			globalThis.location.hash = currentCard.id || currentCard.slug;
		}
	}

	async goToFirstCard() {
		if (this.isTransitioning) return;

		// Find the first card (card index 0)
		const firstCardIndex = this.availableCards.findIndex((card) =>
			card.cardIndex === 0
		);
		if (firstCardIndex !== -1 && firstCardIndex !== this.currentCardIndex) {
			const direction = firstCardIndex < this.currentCardIndex
				? "right"
				: "left";
			this.currentCardIndex = firstCardIndex;
			await this.transitionToCard(direction);
		}
	}

	async previousCard() {
		if (this.isTransitioning) return;

		this.currentCardIndex = this.currentCardIndex > 0
			? this.currentCardIndex - 1
			: this.availableCards.length - 1;
		await this.transitionToCard("right");
	}

	async nextCard() {
		if (this.isTransitioning) return;

		this.currentCardIndex =
			this.currentCardIndex < this.availableCards.length - 1
				? this.currentCardIndex + 1
				: 0;
		await this.transitionToCard("left");
	}

	async transitionToCard(direction) {
		this.isTransitioning = true;

		const contentContainer = document.getElementById("content-container");
		const cardContainer = document.getElementById("card-container");

		// Get viewport width for proper off-screen positioning
		const viewportWidth = globalThis.innerWidth;

		// Determine slide directions
		const slideOutDirection = direction === "left"
			? `-${viewportWidth}px`
			: `${viewportWidth}px`;
		const slideInDirection = direction === "left"
			? `${viewportWidth}px`
			: `-${viewportWidth}px`;

		// Store the initial transforms for precise restoration
		const initialContentTransform = "translate(100px, -50%)";
		const initialCardTransform = "translate(-100px, -50%)";

		// Reset transitions for smooth animation
		if (contentContainer) {
			contentContainer.style.transition = "transform 0.6s ease-in-out";
		}
		if (cardContainer) {
			cardContainer.style.transition = "transform 0.6s ease-in-out";
		}

		// Phase 1: Slide content out first
		if (contentContainer) {
			contentContainer.style.transform =
				`translateY(-50%) translateX(${slideOutDirection})`;
		}

		// Wait 150ms, then slide card out
		await this.wait(150);
		if (cardContainer) {
			cardContainer.style.transform =
				`translateY(-50%) translateX(${slideOutDirection})`;
		}

		// Wait for slide out to complete
		await this.wait(300);

		// Update content while off-screen
		this.updateHash();
		this.updateImage();
		this.updateCardIndicator();
		this.loadComponent();

		// Position elements on the opposite side for slide in
		if (contentContainer) {
			contentContainer.style.transition = "none";
			contentContainer.style.transform =
				`translateY(-50%) translateX(${slideInDirection})`;
		}
		if (cardContainer) {
			cardContainer.style.transition = "none";
			cardContainer.style.transform =
				`translateY(-50%) translateX(${slideInDirection})`;
		}

		// Small delay to ensure positioning is set
		await this.wait(50);

		// Phase 2: Slide card back in first
		if (cardContainer) {
			cardContainer.style.transition = "transform 0.6s ease-in-out";
			cardContainer.style.transform = initialCardTransform;
		}

		// Wait 150ms, then slide content back in
		await this.wait(150);
		if (contentContainer) {
			contentContainer.style.transition = "transform 0.6s ease-in-out";
			contentContainer.style.transform = initialContentTransform;
		}

		// Wait for slide in to complete
		await this.wait(400);

		this.isTransitioning = false;
	}

	updateImage() {
		const cardImage = document.getElementById("card-image");
		if (!cardImage) return;

		const currentCard = this.availableCards[this.currentCardIndex];
		if (!currentCard) return;

		// Handle special case for back card
		if (currentCard.cardIndex === 22) {
			cardImage.src = "/images/tarot/back.png";
			cardImage.alt = "Card Back";
			return;
		}

		// Set image source for current card (using PNG extension for pixel art)
		const cardName = currentCard.name.toLowerCase().replace(/\s+/g, "-");
		const newSrc = `/images/tarot/${currentCard.cardIndex}-${cardName}.png`;

		// Update image source and alt text
		cardImage.src = newSrc;
		cardImage.alt = currentCard.name;
	}

	updateCardIndicator() {
		const indicator = document.getElementById("current-card");
		if (indicator) {
			const currentCard = this.availableCards[this.currentCardIndex];
			if (currentCard) {
				indicator.textContent = currentCard.id;
			}
		}
	}

	loadComponent() {
		// Hide all card content divs
		document.querySelectorAll(".card-content").forEach((card) => {
			card.classList.remove("active");
		});

		const currentCard = this.availableCards[this.currentCardIndex];
		if (!currentCard) return;

		// Update the content title
		const contentTitle = document.getElementById("content-title");
		if (contentTitle) {
			contentTitle.textContent = `${currentCard.id}: ${currentCard.name}`;
		}

		// Show the current card's content
		const currentCardContent = document.getElementById(
			`card-${currentCard.cardIndex}`,
		);

		if (currentCardContent) {
			currentCardContent.classList.add("active");
		}
	}

	wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new Tarot();
});
