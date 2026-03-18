import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { MessagePayload } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBXLP6tA97f8VconJ43KzM_AAvxKa5GUKg",
  authDomain: "switch-dc6ab.firebaseapp.com",
  projectId: "switch-dc6ab",
  storageBucket: "switch-dc6ab.firebasestorage.app",
  messagingSenderId: "685843682169",
  appId: "1:685843682169:web:e1267db8fdd8864f7d55a8"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestFCMToken(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: "BJSlPHcAhsoA-nwjuUj__iXO3o6mU0l3Ml8ZpCLraRysMkr4h0IuUzwsoUyr8vEhxIQsXLvvcvL_3JUi-suAThA",
      serviceWorkerRegistration: registration,
    });
    
    return token;

  } catch (err) {
    console.error("토큰 발급 실패:", err);
    return null;
  }
}

export async function showNotification(title: string, body: string) {
  const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
  if (registration) {
    registration.showNotification(title, { body });
  }
}

export function onForegroundMessage(callback: (payload: MessagePayload) => void): void {
  onMessage(messaging, callback);
}