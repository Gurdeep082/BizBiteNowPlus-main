import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDDETQJplcUCcaMaAHJxFCpo8vmLx2Nznc",
  authDomain: "bizbitenow.firebaseapp.com",
  projectId: "bizbitenow",
  storageBucket: "bizbitenow.firebasestorage.app",
  messagingSenderId: "512483694860",
  appId: "1:512483694860:web:1c439e373aedd625d25129",
};

const VAPID_KEY =
  "BLe1H69PycnukOQL8hOo0sUKGyLiT2upNyRPURqqHj5K0R31-5aHNI5QDF_uQkEbVs7MxOCY_pi4BhlBgboN2xU";

const app = initializeApp(firebaseConfig);
let messagingPromise;

async function getMessagingInstance() {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return null;
  }

  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => (supported ? getMessaging(app) : null))
      .catch(() => null);
  }

  return messagingPromise;
}

function waitForServiceWorkerActivation(registration) {
  return new Promise((resolve) => {
    if (registration.active) {
      resolve(registration);
      return;
    }

    const worker = registration.installing || registration.waiting;

    if (!worker) {
      resolve(registration);
      return;
    }

    worker.addEventListener("statechange", function handler(e) {
      if (e.target.state === "activated") {
        worker.removeEventListener("statechange", handler);
        resolve(registration);
      }
    });
  });
}

export async function requestFcmToken() {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/firebase-cloud-messaging-push-scope" },
    );

    await waitForServiceWorkerActivation(registration);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
}

export async function listenForegroundMessages(callback) {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}
