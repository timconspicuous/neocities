export default async function ReadingProgress() {
	try {
		// Fetch data at build time
		const bookData = await fetchReadingProgress();

		if (!bookData) {
			return renderNoBooks();
		}

		return (
			<div
				class="reading-progress-container"
				dangerouslySetInnerHTML={{
					__html: renderBookProgress(bookData),
				}}
			/>
		);
	} catch (error) {
		return (
			<div
				class="reading-progress-container reading-progress-error"
				dangerouslySetInnerHTML={{
					__html: renderError(
						error instanceof Error
							? error.message
							: "Unknown error",
					),
				}}
			/>
		);
	}
}

// Helper functions (same as before)
async function fetchReadingProgress() {
	try {
		const progressResponse = await fetch(
			"https://pds.timtinkers.online/xrpc/com.atproto.repo.listRecords?repo=did%3Aplc%3Ao6xucog6fghiyrvp7pyqxcs3&collection=social.popfeed.feed.listItem",
		);

		if (!progressResponse.ok) {
			throw new Error(`API request failed: ${progressResponse.status}`);
		}

		const data = await progressResponse.json();

		const booksWithProgress = data.records.filter(
			(record: any) =>
				record.value.bookProgress &&
				record.value.bookProgress.updatedAt,
		);

		if (booksWithProgress.length === 0) {
			return null;
		}

		const mostRecent = booksWithProgress.reduce(
			(latest: any, current: any) => {
				const latestDate = new Date(latest.value.updatedAt);
				const currentDate = new Date(current.value.updatedAt);
				return currentDate > latestDate ? current : latest;
			},
		);

		const progress = {
			isbn13: mostRecent.value.identifiers.isbn13,
			progress: mostRecent.value.bookProgress.percent,
			updatedAt: mostRecent.value.bookProgress.updatedAt,
			totalPages: mostRecent.value.bookProgress.totalPages,
			currentPage: mostRecent.value.bookProgress.currentPage,
		};

		const metadata = await fetchMetadata(progress.isbn13);

		return { ...progress, ...metadata };
	} catch (error) {
		throw new Error(
			`Failed to fetch reading progress: ${(error as Error).message}`,
		);
	}
}

async function fetchMetadata(isbn13: string) {
	const response = await fetch(
		`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn13}&format=json&jscmd=data`,
	);

	if (!response.ok) {
		throw new Error(`API request failed: ${response.status}`);
	}

	const data = await response.json();
	const metadata = Object.values(data)[0] as any;

	return {
		title: metadata.title,
		author: metadata.authors[0]?.name,
		coverUrl: metadata.cover?.medium,
	};
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function renderNoBooks(): string {
	return `
    <div class="reading-progress-empty">
      <p>📚 No books currently in progress</p>
    </div>
  `;
}

function renderError(message: string): string {
	return `
    <p>📚 Unable to load current reading progress</p>
    <small>${message}</small>
  `;
}

function renderBookProgress(book: any): string {
	const coverImage = book.coverUrl
		? `<img src="${book.coverUrl}" alt="Book cover for ${book.title}" class="book-cover" />`
		: '<div class="book-cover-placeholder">📖</div>';

	return `
    <div class="reading-progress-header">
      <span>📚</span> Currently Reading
    </div>
    <div class="book-info">
      ${coverImage}
      <div class="book-details">
        <div class="book-title">
          ${book.title}
        </div>
        <div class="book-author">
          by ${book.author}
        </div>
        <div class="book-meta">
          <span class="progress-badge">In progress</span>
          <span class="last-updated">
            Updated ${formatDate(book.updatedAt)}
          </span>
        </div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${book.progress}%"></div>
      </div>
      <div class="progress-details">
        <span class="progress-percent">${book.progress}%</span>
        <span class="progress-pages">${book.currentPage} / ${book.totalPages} pages</span>
      </div>
    </div>
  `;
}
