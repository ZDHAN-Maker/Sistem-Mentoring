// public/sw.js - Service Worker for Aeterna VAPID Web Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Notifikasi Aeterna',
        body: event.data.text(),
      };
    }
  }

  const title = data.title || 'Aeterna Mentoring';
  const options = {
    body: data.body || 'Anda memiliki aktivitas baru di platform.',
    icon: data.icon || '/assets/Logo Sistem Mentoring.png',
    badge: data.badge || '/assets/Logo Sistem Mentoring.png',
    vibrate: [200, 100, 200],
    tag: data.data?.type || 'aeterna-notification',
    renotify: true,
    data: data.data || { url: '/dashboard' },
    actions: [
      { action: 'open', title: 'Lihat Aktivitas' },
      { action: 'close', title: 'Tutup' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Jika tab sudah terbuka, bawa ke depan dan arahkan URL
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Jika belum ada tab yang terbuka, buka window baru
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
