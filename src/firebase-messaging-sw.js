importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }

firebase.initializeApp({
    apiKey: "AIzaSyAV5GtB2BGs6l6QJDdnzPBMqRcBbT2IC1I",
    authDomain: "iyaapp-f8243.firebaseapp.com",
    projectId: "iyaapp-f8243",
    storageBucket: "iyaapp-f8243.appspot.com",
    messagingSenderId: "206783817158",
    appId: "1:206783817158:web:bc082ffa1be2abb962fec7",
    measurementId: "G-N5S7KCPMQ4"
});

const messaging = firebase.messaging();