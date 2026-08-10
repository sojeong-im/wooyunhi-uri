// Firebase Configuration (Same as script.js)
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
    console.error("Firebase SDK not loaded.");
}

// Password Protection Logic
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const enteredPassword = document.getElementById('adminPassword').value;
    
    // The simple password set by agreement
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
    
    if (typeof db === 'undefined') {
        tbody.innerHTML = '<tr><td colspan="13" style="text-align:center; color:red;">데이터베이스 연결 오류</td></tr>';
        return;
    }

    try {
        const snapshot = await db.collection('applications').orderBy('submittedAt', 'desc').get();
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;">아직 접수된 신청서가 없습니다.</td></tr>';
            return;
        }

        tbody.innerHTML = ''; // Clear loading text

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Format timestamp
            let dateStr = '날짜 없음';
            if (data.submittedAt && data.submittedAt.toDate) {
                const date = data.submittedAt.toDate();
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
        tbody.innerHTML = '<tr><td colspan="13" style="text-align:center; color:red;">데이터를 불러오는 중 오류가 발생했습니다. 권한 문제일 수 있습니다.</td></tr>';
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
