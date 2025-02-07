// ✅ Simple Service Worker (No Firebase Imports)
self.addEventListener("push", function (event) {
  if (event.data) {
    const payload = event.data.json();
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/icon.png",
    });
  }
});
