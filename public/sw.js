const CACHE = "mi-jornada-app-v1";
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add("/")));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_APP") return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const assets = [...new Set(["/", ...event.data.assets])];
      await Promise.all(
        assets.map(async (url) => {
          const response = await fetch(url, { cache: "reload" });
          if (!response.ok) throw new Error("Asset unavailable");
          await cache.put(url, response);
        }),
      );
      event.ports[0]?.postMessage("OFFLINE_READY");
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    url.origin !== self.location.origin ||
    event.request.headers.get("RSC")
  )
    return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put("/", response.clone());
          }
          return response;
        })
        .catch(async () => (await caches.match("/")) || Response.error()),
    );
    return;
  }
  if (url.pathname.startsWith("/_next/static/"))
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(CACHE);
              await cache.put(event.request, response.clone());
            }
            return response;
          }),
      ),
    );
});
