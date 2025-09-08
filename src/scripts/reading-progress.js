class ReadingProgressWidget {
	constructor(containerId) {
		const element = document.getElementById(containerId);
		if (!element) {
			throw new Error(`Element with id "${containerId}" not found`);
		}
		this.container = element;
		this.currentBook = null;
		this.init();
	}

	async init() {
		this.showLoading();
		try {
			const progress = await this.fetchReadingProgress();
			const metadata = await this.fetchMetadata(progress.isbn13);

			this.currentBook = { ...progress, ...metadata };
			this.render();
		} catch (error) {
			this.showError(
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	}

	async fetchReadingProgress() {
		const response = await fetch(
			"https://pds.timtinkers.online/xrpc/com.atproto.repo.listRecords?repo=did%3Aplc%3Ao6xucog6fghiyrvp7pyqxcs3&collection=social.popfeed.feed.listItem",
		);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();

		// Filter for entries with bookProgress field
		const booksWithProgress = data.records.filter(
			(record) =>
				record.value.bookProgress &&
				record.value.bookProgress.updatedAt,
		);

		if (booksWithProgress.length === 0) {
			this.currentBook = null;
			return;
		}

		// Find the most recently updated book
		const mostRecent = booksWithProgress.reduce((latest, current) => {
			const latestDate = new Date(latest.value.updatedAt);
			const currentDate = new Date(current.value.updatedAt);
			return currentDate > latestDate ? current : latest;
		});

		return {
			isbn13: mostRecent.value.identifiers.isbn13,
			progress: mostRecent.value.bookProgress.percent,
			updatedAt: mostRecent.value.bookProgress.updatedAt,
		};
	}

	async fetchMetadata(isbn13) {
		const response = await fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn13}&format=json&jscmd=data`,
		);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		const metadata = Object.values(data)[0];

		return {
			title: metadata.title,
			author: metadata.authors[0]?.name,
			coverUrl: metadata.cover?.medium,
		};
	}

	showLoading() {
		this.container.innerHTML = `
      <div class="reading-progress loading">
        <div class="progress-skeleton">
          <div class="skeleton-text"></div>
          <div class="skeleton-bar"></div>
        </div>
      </div>
    `;
	}

	showError(message) {
		this.container.innerHTML = `
      <div class="reading-progress error">
        <p>📚 Unable to load current reading progress</p>
        <small>${message}</small>
      </div>
    `;
	}

	formatDate(dateString) {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	render() {
		if (!this.currentBook) {
			this.container.innerHTML = `
        <div class="reading-progress empty">
          <p>📚 No books currently in progress</p>
        </div>
      `;
			return;
		}

		const coverImage = this.currentBook.coverUrl
			? `<img src="${this.currentBook.coverUrl}" alt="Book cover for ${
				this.escapeHtml(this.currentBook.title)
			}" class="book-cover" />`
			: '<div class="book-cover-placeholder">📖</div>';

		this.container.innerHTML = `
      <div class="reading-progress">
        <h3>📚 Currently Reading</h3>
        <div class="book-info">
          <div class="book-header">
            ${coverImage}
            <div class="book-text">
              <div class="book-title">
              ${this.escapeHtml(this.currentBook.title)}</div>
              <div class="book-author">
              by ${this.escapeHtml(this.currentBook.author)}</div>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width: ${this.currentBook.progress}%"
              ></div>
            </div>
            <div class="progress-text">
              ${this.currentBook.progress}% complete
            </div>
          </div>
          <div class="last-updated">
            Updated ${this.formatDate(this.currentBook.updatedAt)}
          </div>
        </div>
      </div>
    `;
	}

	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	const widgets = document.querySelectorAll("[data-reading-progress]");
	widgets.forEach((widget) => {
		if (widget.id) {
			new ReadingProgressWidget(widget.id);
		}
	});
});
