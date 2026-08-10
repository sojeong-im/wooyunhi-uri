import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyChLxdS6RzKRg3z4LXBAKyxKQxQ1OJkA_E",
  authDomain: "wooyunhi-uri.firebaseapp.com",
  projectId: "wooyunhi-uri",
  storageBucket: "wooyunhi-uri.firebasestorage.app",
  messagingSenderId: "390487851878",
  appId: "1:390487851878:web:19d48fd80b80602e487ea7",
  measurementId: "G-RT8Q2VMCE7"
};

let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase init error:", e);
}

// Modal Functions
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        window.closeModal(event.target.id);
    }
}

// Form Submit Handling
window.submitForm = async function(event, modalId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const applicationData = Object.fromEntries(formData.entries());
    
    if (!db) {
        alert("시스템 오류: 데이터베이스에 연결할 수 없습니다. (Adblock을 끄거나 새로고침 해주세요)");
        return;
    }
    
    try {
        applicationData.submittedAt = serverTimestamp();
    } catch (e) {
        applicationData.submittedAt = new Date().toISOString();
    }
    
    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = '제출 중...';
        submitBtn.disabled = true;

        await addDoc(collection(db, "applications"), applicationData);

        window.closeModal(modalId);
        form.reset();
        window.showToast();
        
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("오류 발생: " + error.message + "\n(관리자에게 문의해주세요!)");
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

window.showToast = function() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
