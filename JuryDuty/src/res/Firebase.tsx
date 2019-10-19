import firebase from 'firebase'; 

/* Pluck values from `google-services.json` */
let config = {  
    clientId: "545827642477-etilk80q7kd0ii6h8d3or5gatrl1gdo0.apps.googleusercontent.com",
    appId: 'juryduty',
    apiKey: 'AIzaSyBOue2dTKxbVzCSVwgjFIEv3h3zHDmT0D0',
    databaseURL: 'https://juryduty-5b884.firebaseio.com/',
    storageBucket: 'juryduty-5b884.appspot.com',
    messagingSenderId: 'admin',
    projectId: 'juryduty-5b884',
    persistence: true,
};

let app = firebase.initializeApp(config,'juryduty');  

// Export database
export const data_base = app.database();  


// Export firebase
export const fire_base = app;