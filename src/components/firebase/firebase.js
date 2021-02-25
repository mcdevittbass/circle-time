import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.auth = app.auth();
        this.db = app.database();
    }

    // Auth API
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    doReauthenticate = (password) => {
        const user = this.auth.currentUser;
        const credential = app.auth.EmailAuthProvider.credential(user.email, password);
        return user.reauthenticateWithCredential(credential);
    }

    user = uid => this.db.ref(`users/${uid}`);

    room = roomId => this.db.ref(`rooms/${roomId}`);

    rooms = () => this.db.ref('rooms');
    

    stopListeningToRoom = roomId => {
        const roomRef = this.db.ref(`rooms/${roomId}`);
        roomRef.off();
    } 
    
    createRoom = async (uid, params = {}) => {
        let roomKey = null;
        try {
            const roomRef = await this.rooms().push(); //create room object
            roomKey = roomRef.key; //get key reference to room
        
            try {
                roomRef.set(params); //set paramaters of room object
                try {
                    const snap = await this.user(uid).child("ownedRooms").get();
                    let updated = {};
                    updated = snap.exists()
                        ? {...snap.val(), [roomKey]: true}
                        : {[roomKey]: true}
                    this.user(uid).update({ownedRooms: updated}); //add a ref in the main user's account
                    if(params.cohosts) {
                        for(let userId in params.cohosts) { //add refs in cohost user accounts
                            try {
                            const snapshot = await this.user(userId).child("cohostedRooms").get();
                            updated = snapshot.exists() 
                                ? {...snapshot.val(), [roomKey]: true}
                                : {[roomKey]: true};

                            this.user(userId).update({ cohostedRooms: updated });
                            
                            } catch(err) {
                                console.error(err);
                            }
                        }
                    }
                } catch(err) {
                    console.error(err);
                }
            } catch(err) {
                console.error(err);
            }
        } catch(err) {
            console.error(err);
        }
        return roomKey;    
    }

    updateRoom = async (roomId, params) => {
        //STILL NEED TO SOLVE => deleting rooms from users when cohost is removed
        const roomRef = this.room(roomId);
        roomRef.update(params);
        (async () => {
            if(Object.keys(params.cohosts).length) {
                for(let host in params.cohosts) {
                    try {
                        const snapshot = await this.user(host).child("cohostedRooms").get();
                        if(snapshot.exists()) {
                            const cohostedRooms = snapshot.val();
                            if(!Object.keys(cohostedRooms).includes(roomId)) {
                                this.user(host).child("cohostedRooms").update({[roomId]: true})
                            }
                        }
                    } catch(err) {
                        console.error(err);
                    }   
                }
            }

        })();
    }

}

export default Firebase;