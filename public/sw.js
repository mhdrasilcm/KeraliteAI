// Minimal service worker: presence alone is what makes browsers offer
// "Install app" / "Add to Home Screen" on mobile. Expand with real caching
// once the resource/chat APIs are stable.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("fetch", () => {
  // Pass-through for now — no offline caching yet.
});
