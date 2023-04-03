// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAmbCUHI44VLGK6xG7KAY8mn68paLTf8Ic",
    authDomain: "instagram-11374.firebaseapp.com",
    databaseURL: "https://instagram-11374-default-rtdb.firebaseio.com",
    projectId: "instagram-11374",
    storageBucket: "instagram-11374.appspot.com",
    messagingSenderId: "381736580675",
    appId: "1:381736580675:web:4ecd1e5aaa4f14dbbe06f6"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});