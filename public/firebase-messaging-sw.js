importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDDETQJplcUCcaMaAHJxFCpo8vmLx2Nznc",
  authDomain: "bizbitenow.firebaseapp.com",
  projectId: "bizbitenow",
  storageBucket: "bizbitenow.firebasestorage.app",
  messagingSenderId: "512483694860",
  appId: "1:512483694860:web:1c439e373aedd625d25129",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  const icon = payload.data?.icon || "/favicon-96x96.png";

  self.registration.showNotification(title || "Notification", {
    body: body || "",
    icon,
    data: payload.data,
  });
});
