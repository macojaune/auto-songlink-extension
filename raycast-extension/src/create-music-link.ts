import { Clipboard, showToast, Toast } from "@raycast/api"; // Removed getPreferenceValues

// Updated API response structure based on your provided type
interface ApiResponse {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string; // This is the multiplatform link we need
  linksByPlatform: {
    [key: string]: unknown; // Keeping this generic for now, as we only need pageUrl
  };
  entitiesByUniqueId: {
    [key: string]: unknown; // Keeping this generic
  };
  error?: string; // For potential API errors
}

const SUPPORTED_PROVIDERS: string[] = [
  'spotify', 'itunes', 'appleMusic', 'youtube', 'youtubeMusic',
  'google', 'googleStore', 'pandora', 'deezer', 'tidal',
  'amazonStore', 'amazonMusic', 'soundcloud', 'napster', 'yandex',
  'spinrilla', 'audius', 'audiomack', 'anghami', 'boomplay',
];

// Function to check if the URL is from a supported provider
function isSupportedMusicLink(url: string): boolean {
  if (!url) return false;
  const lowercasedUrl = url.toLowerCase();
  return SUPPORTED_PROVIDERS.some(provider => lowercasedUrl.includes(provider.toLowerCase()));
}

export default async function Command() {
  try {
    const clipboardText = await Clipboard.readText();

    if (!clipboardText) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Clipboard is empty",
        message: "Copy a music link first.",
      });
      return;
    }

    if (!isSupportedMusicLink(clipboardText)) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Unsupported Link",
        message: "The copied text doesn't look like a supported music link.",
      });
      return;
    }

    await showToast({
      style: Toast.Style.Animated,
      title: "Processing Link...",
    });

    // --- API Call ---
    // API base URL is now hardcoded
    const API_BASE_URL = "https://api.song.link/v1-alpha.1/links?url=";

    // Construct the full API URL with the clipboard content
    const fullApiUrl = `${API_BASE_URL}${encodeURIComponent(clipboardText)}`;

    const headers = {
      "Content-Type": "application/json", // May not be strictly necessary for a GET request without a body
    };
    // apiToken logic removed as it's not needed

    const response = await fetch(fullApiUrl, {
      method: "GET", // Changed to GET
      headers: headers,
      // body: JSON.stringify(requestBody), // Body is not needed for GET with URL params
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = await response.json() as ApiResponse;
        if (errorData.error) {
          errorMessage = `API Error: ${errorData.error}`;
        }
      } catch (e) {
        // Failed to parse error JSON, stick with statusText
      }
      await showToast({
        style: Toast.Style.Failure,
        title: "API Request Failed",
        message: errorMessage,
      });
      return;
    }

    const data = (await response.json()) as ApiResponse;

    if (data.pageUrl) { // Changed from data.multiplatformUrl to data.pageUrl
      await Clipboard.copy(data.pageUrl); // Changed from data.multiplatformUrl to data.pageUrl
      await showToast({
        style: Toast.Style.Success,
        title: "Link Copied!",
        message: "Multiplatform music link is now in your clipboard.",
      });
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "Conversion Failed",
        message: data.error || "Could not retrieve multiplatform link from API.",
      });
    }
  } catch (error) {
    let message = "An unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: message,
    });
  }
}