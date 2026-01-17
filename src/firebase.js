import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase 콘솔 > 프로젝트 설정 > 내 앱 > SDK 설정 및 구성에서 복사해오세요!
const firebaseConfig = {
  apiKey: "AIzaSyB5ygkZFGdcW29lfkDROb1myfK5lSQ0mFM",
  authDomain: "swimap-d78a2.firebaseapp.com",
  projectId: "swimap-d78a2",
  storageBucket: "swimap-d78a2.firebasestorage.app",
  messagingSenderId: "739338111841",
  appId: "1:739338111841:web:119c15b28db62ef6c79320"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);