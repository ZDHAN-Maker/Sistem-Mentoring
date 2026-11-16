// src/services/webPush.js - VAPID Web Push Client Service
import api from '../axiosInstance';

// Helper converter Base64URL string to Uint8Array for VAPID applicationServerKey
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const isPushSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
};

export const getNotificationPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

// Daftarkan service worker
export const registerServiceWorker = async () => {
  if (!isPushSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Langganan Web Push menggunakan VAPID
export const subscribeUserToPush = async () => {
  if (!isPushSupported()) {
    throw new Error('Browser Anda tidak mendukung Web Push Notifications.');
  }

  // 1. Minta izin ke pengguna
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Izin notifikasi tidak diberikan oleh pengguna.');
  }

  // 2. Ambil service worker registration
  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    registration = await registerServiceWorker();
  }

  if (!registration) {
    throw new Error('Gagal menginisialisasi Service Worker.');
  }

  // 3. Ambil VAPID Public Key dari backend API
  const keyRes = await api.get('/push-subscriptions/vapid-key');
  const vapidPublicKey = keyRes.data?.public_key;

  if (!vapidPublicKey) {
    throw new Error('Kunci VAPID tidak ditemukan di server.');
  }

  const convertedVapidKey = urlB64ToUint8Array(vapidPublicKey);

  // 4. Daftarkan push subscription ke PushManager browser
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
  }

  const subJson = subscription.toJSON();

  // 5. Simpan langganan ke backend database
  await api.post('/push-subscriptions', {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subJson.keys?.p256dh,
      auth: subJson.keys?.auth,
    },
    content_encoding: (PushManager.supportedContentEncodings || ['aesgcm'])[0],
  });

  return subscription;
};

// Unsubscribe Web Push
export const unsubscribeUserFromPush = async () => {
  if (!isPushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await api.delete('/push-subscriptions', {
          data: { endpoint: subscription.endpoint }
        });
        await subscription.unsubscribe();
      }
    }
  } catch (error) {
    console.error('Error unsubscribing push:', error);
  }
};

// Kirim notifikasi uji coba ke browser
export const sendTestPushNotification = async () => {
  const res = await api.post('/push-subscriptions/test');
  return res.data;
};
