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

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: "https://switch.louter.site/switchLogo.png"
  });
});