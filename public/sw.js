/* ===========================================================
 * TiloBox QR Studio - Progressive Web App Service Worker
 * Production-ready, offline-first caching & background sync
 * 100% Client-Side Private QR Code Generation & Display Cards
 * =========================================================== */

const CACHE_NAME = "tilobox-qr-studio-v1";
const OFFLINE_FALLBACK_URL = "/";

// Core static assets to precache on install
const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/manifest.json",
  "/icon.svg",
  "/assets/img/tilobox-logo.svg",
  "/assets/favicon/icon-192x192.png",
  "/assets/favicon/icon-512x512.png",
  "/assets/favicon/icon-maskable-512x512.png",
  "/assets/favicon/apple-touch-icon.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/favicon-16x16.png",
  "/assets/qrcodes/a1.svg",
  "/assets/qrcodes/a2.svg",
  "/assets/qrcodes/sp1.svg",
  "/assets/qrcodes/sp2.svg",
];

// 1. Install event: Precache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("[SW] Precache partial error (continuing):", err);
        });
      })
  );
  self.skipWaiting();
});

// 2. Activate event: Clean up stale caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Message event: Support SKIP_WAITING from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Helper: Check if request is for static asset
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff")
  );
}

// 4. Fetch event: Strategic caching
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't intercept non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // A. Static Assets (_next/static, images, fonts): Cache-First
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => {
            return new Response("", { status: 408, statusText: "Offline" });
          });
      })
    );
    return;
  }

  // B. HTML Navigation Requests: Network-First with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed -> return cached version of this page
          const cached = await caches.match(request);
          if (cached) return cached;

          // Fallback to root or default cached navigation
          const fallback = await caches.match(OFFLINE_FALLBACK_URL);
          if (fallback) return fallback;

          return new Response(
            `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Offline – TiloBox QR Studio</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: center;
      padding: 48px 24px;
      background: #0b0f19;
      color: #f1f5f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      margin: 0 0 12px 0;
      letter-spacing: -0.02em;
    }
    p {
      color: #94a3b8;
      max-width: 420px;
      margin: 0 0 28px 0;
      font-size: 15px;
      line-height: 1.5;
    }
    .btn {
      background: #0b5fa5;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: opacity 0.2s ease;
    }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="badge">Offline Ready</div>
  <h1>TiloBox QR Studio</h1>
  <p>You are currently offline. TiloBox QR Studio processes and generates parametric QR codes 100% in your browser.</p>
  <button class="btn" onclick="location.reload()">Reload App</button>
</body>
</html>`,
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
