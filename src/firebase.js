import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCIKiw4wi8Z2v3479J1wZWCtAKqIQeinss",
    authDomain: "splek-68ae9.firebaseapp.com",
    projectId: "splek-68ae9",
    storageBucket: "splek-68ae9.firebasestorage.app",
    messagingSenderId: "930240530814",
    appId: "1:930240530814:web:c6c5e94f646aef33558b2f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Add these configurations
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = false; 