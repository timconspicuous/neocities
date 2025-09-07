// Helper script to deploy the files to Neocities
import { NeocitiesAPIClient } from "npm:async-neocities";
import { load } from "jsr:@std/dotenv";

await load({ export: true });

// Get credentials from environment
const siteName = Deno.env.get("NEOCITIES_SITE_NAME");
const password = Deno.env.get("NEOCITIES_PASSWORD");

if (!siteName || !password) {
	throw new Error(
		"Please set NEOCITIES_SITE_NAME and NEOCITIES_PASSWORD environment variables.",
	);
}

const apiKeyResponse = await NeocitiesAPIClient.getKey({
	siteName: siteName,
	ownerPassword: [password],
});

const client = new NeocitiesAPIClient(apiKeyResponse.api_key);

// Deploy the site
await client.deploy({
	directory: "./public",
	cleanup: true, // Delete orphaned files
	includeUnsupportedFiles: false, // Upload unsupported files (paid feature)
});

console.log("Successfully deployed to Neocities!");
