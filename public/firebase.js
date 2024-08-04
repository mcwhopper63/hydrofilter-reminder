import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';

const firebaseConfig = {
    apiKey: 'AIzaSyDXxncdx0st-lbDnHhO6PwWsEtK2HPW0Mw',
    authDomain: 'hydrofilter-reminder.firebaseapp.com',
    projectId: 'hydrofilter-reminder',
    storageBucket: 'hydrofilter-reminder.appspot.com',
    messagingSenderId: '575462645069',
    appId: '1:575462645069:web:9f773b07eb7a176414ab04',
    measurementId: 'G-MEZ531DRV2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// this analytics line is giving me issues on the front end. let's revisit this later.
// const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export async function addReminder(
    email,
    filterType,
    startDate,
    replacementDate
) {
    try {
        const docRef = await addDoc(collection(db, 'reminders'), {
            email: email,
            filterType: filterType,
            startDate: startDate,
            replacementDate: replacementDate,
        });
        console.log('Document written with ID: ', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('Error adding document: ', e);
        throw e;
    }
}

export async function shareWithFriend(friendEmail) {
    try {
        const docRef = await addDoc(collection(db, 'shares'), {
            friendEmail: friendEmail,
            sharedAt: new Date(),
        });
        console.log('Share document written with ID: ', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('Error sharing with friend: ', e);
        throw e;
    }
}

export { db };
