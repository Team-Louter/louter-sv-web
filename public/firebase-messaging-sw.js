importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBXLP6tA97f8VconJ43KzM_AAvxKa5GUKg",
  authDomain: "switch-dc6ab.firebaseapp.com",
  projectId: "switch-dc6ab",
  messagingSenderId: "685843682169",
  appId: "1:685843682169:web:e1267db8fdd8864f7d55a8"
});

const messaging = firebase.messaging();

self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data?.json();
  } catch {
    return;
  }

  if (!data) return;

  const title = data.notification?.title ?? data.data?.title ?? '알림';
  const body = data.notification?.body ?? data.data?.body ?? '';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const isForeground = clients.some((client) => client.visibilityState === 'visible');

      if (isForeground) {
        clients.forEach((client) => {
          if (client.visibilityState === 'visible') {
            client.postMessage({ type: 'PUSH_RECEIVED', title, body });
          }
        });
        return;
      }

      return self.registration.showNotification(title, {
        body,
      });
    })
  );
});