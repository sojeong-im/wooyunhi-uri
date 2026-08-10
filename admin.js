import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Password Protection Logic
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const enteredPassword = document.getElementById('adminPassword').value;
    
    if (enteredPassword === '00347') {
        document.getElementById('passwordOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadApplications();
    } else {
        document.getElementById('passwordError').style.display = 'block';
        document.getElementById('adminPassword').value = '';
    }
});

// Load Data from Firestore
async function loadApplications() {
    const tbody = document.getElementById('applicantTableBody');
    
    if (!db) {
        tbody.innerHTML = '<tr><td colspan="13" style="text-align:center; color:red;">데이터베이스에 연결할 수 없습니다.</td></tr>';
        return;
    }

    try {
        const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;">아직 접수된 신청서가 없습니다.</td></tr>';
            return;
        }

        tbody.innerHTML = ''; // Clear loading text

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Format timestamp
            let dateStr = '날짜 없음';
            if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
                const date = data.submittedAt.toDate();
                dateStr = `${date.getMonth()+1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            } else if (typeof data.submittedAt === 'string') {
                const date = new Date(data.submittedAt);
                dateStr = `${date.getMonth()+1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="white-space: nowrap;">${dateStr}</td>
                <td style="font-weight: bold;">${escapeHtml(data.name || '')}</td>
                <td>${escapeHtml(data.gender || '')}</td>
                <td>${escapeHtml(data.birth_year ? data.birth_year + '년생' : '')}</td>
                <td>${escapeHtml(data.status || '')}</td>
                <td>${escapeHtml(data.school_company || '')}</td>
                <td>${escapeHtml(data.region || '')}</td>
                <td>${escapeHtml(data.mbti || '')}</td>
                <td style="white-space: nowrap;">${escapeHtml(data.phone || '')}</td>
                <td>${escapeHtml(data.channel || '')}</td>
                <td><div class="scroll-cell">${escapeHtml(data.expected_activity || '')}</div></td>
                <td><div class="scroll-cell">${escapeHtml(data.reason || '')}</div></td>
                <td><div class="scroll-cell">${escapeHtml(data.comments || '')}</div></td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error fetching applications: ", error);
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center; color:red;">데이터를 불러오는 중 오류가 발생했습니다.<br>상세 오류: ${error.message}</td></tr>`;
    }
}

// Utility to prevent XSS in table
function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
         .toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
