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
function submitForm(event, modalId) {
    event.preventDefault(); // Prevent page reload
    
    // In a real app, we would collect data and send to a server here.
    // For this landing page, we just show a success message and close the modal.
    
    closeModal(modalId);
    
    // Reset form
    event.target.reset();
    
    // Show toast
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}
