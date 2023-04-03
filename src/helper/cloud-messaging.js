import { getMessaging, getToken } from 'firebase/messaging';
import { messaging } from './firebase';


export const requestForToken = () => {
    return getToken(messaging, { vapidKey: 'BE9JS1AG11nrF2gltSyQY5YuzCrouXqNV8nZOmoo2r8rqebP-JrYub_VATRRdO0i_M0UFXvTPHZ5LfXtXwHgvPo' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                // Perform any other neccessary action with the token
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};