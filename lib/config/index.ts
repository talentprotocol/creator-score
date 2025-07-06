export * from "./env";
export * from "./constants";
export * from "./features";

// Utility to generate Farcaster frame meta tags
import { FARCASTER_FRAME, OPEN_GRAPH } from "./constants";

export function generateFrameMetaTags(): Record<string, string> {
  const metaTags: Record<string, string> = {
    // Farcaster Frame Meta Tags
    "fc:frame": FARCASTER_FRAME.version,
    "fc:frame:image": FARCASTER_FRAME.image.url,
    // XMTP Support
    "of:accepts:xmtp": FARCASTER_FRAME.xmtp.version,
  };

  // Add buttons dynamically
  FARCASTER_FRAME.buttons.forEach((button, index) => {
    const buttonNum = index + 1;
    metaTags[`fc:frame:button:${buttonNum}`] = button.text;
    metaTags[`fc:frame:button:${buttonNum}:action`] = button.action;
    metaTags[`fc:frame:button:${buttonNum}:target`] = button.target;
  });

  return metaTags;
}

export function generateOpenGraphConfig() {
  return {
    title: OPEN_GRAPH.title,
    description: OPEN_GRAPH.description,
    type: OPEN_GRAPH.type,
    images: [
      {
        url: OPEN_GRAPH.image.url,
        width: 1200,
        height: 630,
        alt: OPEN_GRAPH.image.alt,
      },
    ],
  };
}
