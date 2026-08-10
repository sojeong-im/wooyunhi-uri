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

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
} else {
    console.warn("Firebase SDK not loaded.");
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    // Small delay to allow display:block to apply before adding opacity for transition
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // match transition duration
    // Restore background scrolling
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}

// Form Submit Handling
async function submitForm(event, modalId) {
    event.preventDefault(); // Prevent page reload
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    const applicationData = Object.fromEntries(formData.entries());
    
    // Add timestamp
    applicationData.submittedAt = firebase.firestore.FieldValue.serverTimestamp();
    
    try {
        // Change submit button state to prevent double submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = '제출 중...';
        submitBtn.disabled = true;

        if (typeof db !== 'undefined') {
            // Save to Firestore
            await db.collection("applications").add(applicationData);
        } else {
            console.error("Firestore is not initialized.");
            alert("시스템 오류: 데이터베이스에 연결할 수 없습니다.");
        }

        // Success handling
        closeModal(modalId);
        form.reset();
        showToast();
        
        // Reset button
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}
