// Import the functions you need from the SDKs you need
import { initializeApp ,getApps} from "firebase/app";
import {initializeAuth,getReactNativePersistence,getAuth} from 'firebase/auth';
import ReactNativeAsycStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyDtsjnRNNEQ9Ly4FATNjpH3YYv_O2zrEl0",
  authDomain: "chatbot-739bf.firebaseapp.com",
  projectId: "chatbot-739bf",
  storageBucket: "chatbot-739bf.firebasestorage.app",
  messagingSenderId: "834603221290",
  appId: "1:834603221290:web:52e0fe16b94cb4e9295e53"
};
let auth;
if (getApps().length==0){
    const app = initializeApp(firebaseConfig);
auth=initializeAuth(app,{
    persistence:getReactNativePersistence(ReactNativeAsycStorage)
})
}
else{
    auth=getAuth();
}


export default auth;