import React from 'react';
import Firebase from './firebase';
 
export const FirebaseContext = React.createContext();

const FirebaseContextProvider = ({ children }) => {
    const firebase = new Firebase();
    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}
 
export default FirebaseContextProvider;