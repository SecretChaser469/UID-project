
window.toggleBucketListItem = toggleBucketListItem;
window.deleteBucketListItem = deleteBucketListItem;
window.deleteNote = deleteNote;

function logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        
        const user = JSON.parse(localStorage.getItem('userData'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        document.getElementById('userName').textContent = user.name || 'User';
        document.getElementById('userEmail').textContent = user.email || '';
        
        initializeDashboard(user.id);
        
        setupEventListeners(user.id);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Failed to initialize dashboard', 'error');
    }
});

function setupEventListeners(userId) {
    
    const addPlaceBtn = document.getElementById('addPlaceBtn');
    const newPlaceInput = document.getElementById('newPlace');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const setBudgetBtn = document.getElementById('setBudgetBtn');
    const addSpentBtn = document.getElementById('addSpentBtn');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const budgetAmountInput = document.getElementById('budgetAmount');
    const spentInput = document.getElementById('spentInput');
    const newNoteInput = document.getElementById('newNote');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (addPlaceBtn) {
        addPlaceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addBucketListItem(userId);
        });
    }
    
    if (newPlaceInput) {
        newPlaceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addBucketListItem(userId);
            }
        });
    }
   
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openEditProfile();
        });
    }
    
    if (setBudgetBtn) {
        setBudgetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateBudget(userId);
        });
    }
    if (budgetAmountInput) {
        budgetAmountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateBudget(userId);
            }
        });
    }
    
    if (addSpentBtn) {
        addSpentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addSpentAmount(userId);
        });
    }
    if (spentInput) {
        spentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSpentAmount(userId);
            }
        });
    }
   
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addNote(userId);
        });
    }
    if (newNoteInput) {
        newNoteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNote(userId);
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}
function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}
function initializeDashboard(userId) {
    const bucketList = JSON.parse(localStorage.getItem(`bucketList_${userId}`)) || [];
    displayBucketList(bucketList, userId);
    const budget = JSON.parse(localStorage.getItem(`budget_${userId}`)) || {
        total: 0,
        spent: 0
    };
    updateBudgetDisplay(budget);
    const notes = JSON.parse(localStorage.getItem(`notes_${userId}`)) || [];
    displayNotes(notes, userId);
}

function addBucketListItem(userId) {
    console.log('addBucketListItem called with userId:', userId);
    const newPlaceInput = document.getElementById('newPlace');
    console.log('newPlaceInput:', newPlaceInput);
    if (!newPlaceInput) {
        console.error('Could not find newPlace input element');
        return;
    }
    const placeName = newPlaceInput.value.trim();
    console.log('Place name:', placeName);
    if (placeName) {
        const bucketList = JSON.parse(localStorage.getItem(`bucketList_${userId}`)) || [];
        console.log('Current bucket list:', bucketList);
        
        const exists = bucketList.some(item => 
            item.name.toLowerCase() === placeName.toLowerCase()
        );
        if (exists) {
            console.log('Place already exists in bucket list');
            alert('This place is already in your bucket list!');
            return;
        }
        const newItem = {
            id: Date.now(),
            name: placeName,
            completed: false,
            dateAdded: new Date().toISOString()
        };
        console.log('Adding new item:', newItem);
        bucketList.push(newItem);
        localStorage.setItem(`bucketList_${userId}`, JSON.stringify(bucketList));
        
        const updatedList = JSON.parse(localStorage.getItem(`bucketList_${userId}`)) || [];
        console.log('Updated bucket list:', updatedList);
        displayBucketList(updatedList, userId);
        newPlaceInput.value = '';
        newPlaceInput.focus();
    } else {
        console.log('No place name entered');
        alert('Please enter a place name');
    }
}
function toggleBucketListItem(id, userId) {
    const bucketList = JSON.parse(localStorage.getItem(`bucketList_${userId}`)) || [];
    const updatedList = bucketList.map(item => {
        if (item.id === id) {
            return { ...item, completed: !item.completed };
        }
        return item;
    });
    localStorage.setItem(`bucketList_${userId}`, JSON.stringify(updatedList));
    displayBucketList(updatedList, userId);
}
function deleteBucketListItem(id, userId) {
    const bucketList = JSON.parse(localStorage.getItem(`bucketList_${userId}`)) || [];
    const updatedList = bucketList.filter(item => item.id !== id);
    localStorage.setItem(`bucketList_${userId}`, JSON.stringify(updatedList));
    displayBucketList(updatedList, userId);
}
function displayBucketList(bucketList, userId) {
    console.log('displayBucketList called with:', { bucketList, userId });
    const list = document.getElementById('bucketList');
    if (!list) {
        console.error('Could not find bucketList element');
        return;
    }
    
    list.innerHTML = '';
    // Handle empty list
    if (!bucketList || bucketList.length === 0) {
        console.log('No items in bucket list');
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Your bucket list is empty. Add some places!';
        emptyMessage.className = 'empty-message';
        list.appendChild(emptyMessage);
        return;
    }
    
    bucketList.forEach(item => {
        try {
            const li = document.createElement('li');
            li.className = 'bucket-item' + (item.completed ? ' completed' : '');
            li.innerHTML = `
                <div class="item-content">
                    <label class="checkbox-container">
                        <input type="checkbox" ${item.completed ? 'checked' : ''} 
                            onchange="window.toggleBucketListItem(${item.id}, '${userId}')">
                        <span class="checkmark"></span>
                        <span class="item-name">${item.name}</span>
                    </label>
                </div>
                <button onclick="window.deleteBucketListItem(${item.id}, '${userId}')" 
                        class="btn btn-outline btn-sm delete-btn"
                        aria-label="Delete ${item.name}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            list.appendChild(li);
        } catch (error) {
            console.error('Error rendering bucket list item:', error);
        }
    });
    console.log('Bucket list rendered successfully');
}
function updateBudget(userId) {
    const input = document.getElementById('budgetAmount');
    const amount = parseFloat(input.value);
    if (!isNaN(amount) && amount >= 0) {
        const budget = JSON.parse(localStorage.getItem(`budget_${userId}`)) || {
            total: 0,
            spent: 0
        };
        budget.total = amount;
        localStorage.setItem(`budget_${userId}`, JSON.stringify(budget));
        updateBudgetDisplay(budget);
        input.value = '';
    } else {
        alert('Please enter a valid budget amount');
    }
}
function addSpentAmount(userId) {
    const input = document.getElementById('spentInput');
    const amount = parseFloat(input.value);
    if (!isNaN(amount) && amount >= 0) {
        const budget = JSON.parse(localStorage.getItem(`budget_${userId}`)) || {
            total: 0,
            spent: 0
        };
        budget.spent += amount;
        localStorage.setItem(`budget_${userId}`, JSON.stringify(budget));
        updateBudgetDisplay(budget);
        input.value = '';
    } else {
        alert('Please enter a valid amount');
    }
}
function updateBudgetDisplay(budget) {
    document.getElementById('totalBudget').textContent = `$${budget.total.toFixed(2)}`;
    document.getElementById('spentAmount').textContent = `$${budget.spent.toFixed(2)}`;
    const remaining = budget.total - budget.spent;
    const remainingElement = document.getElementById('remainingAmount');
    remainingElement.textContent = `$${remaining.toFixed(2)}`;
    if (remaining < 0) {
        remainingElement.style.color = '#ff4444'; // Red for negative balance
    } else if (remaining < budget.total * 0.2) {
        remainingElement.style.color = '#ffbb33'; // Yellow for low balance (less than 20%)
    } else {
        remainingElement.style.color = '#00C851'; // Green for healthy balance
    }
}
function addNote(userId) {
    const input = document.getElementById('newNote');
    const content = input.value.trim();
    if (content) {
        const notes = JSON.parse(localStorage.getItem(`notes_${userId}`)) || [];
        notes.push({
            id: Date.now(),
            content: content,
            date: new Date().toISOString()
        });
        localStorage.setItem(`notes_${userId}`, JSON.stringify(notes));
        displayNotes(notes, userId);
        input.value = '';
    }
}
function displayNotes(notes, userId) {
    const list = document.getElementById('notesList');
    list.innerHTML = '';
    notes.reverse().forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
            <p>${note.content}</p>
            <div class="note-footer">
                <small>${new Date(note.date).toLocaleDateString()}</small>
                <button onclick="deleteNote(${note.id}, '${userId}')" class="btn btn-outline">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(div);
    });
}
function deleteNote(id, userId) {
    const notes = JSON.parse(localStorage.getItem(`notes_${userId}`)) || [];
    const updatedNotes = notes.filter(note => note.id !== id);
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));
    displayNotes(updatedNotes, userId);
}

function openEditProfile() {
    
    const user = JSON.parse(localStorage.getItem('userData'));
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Profile</h3>
                <span class="close">&times;</span>
            </div>
            <form id="profileForm">
                <div class="form-group">
                    <label for="editName">Name</label>
                    <input type="text" id="editName" value="${user.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" value="${user.email || ''}" disabled>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" id="cancelEdit">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
   
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('#cancelEdit');
    const form = modal.querySelector('#profileForm');
    
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    };
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const newName = document.getElementById('editName').value.trim();
        if (newName) {
            
            user.name = newName;
            localStorage.setItem('userData', JSON.stringify(user));
            
            document.getElementById('userName').textContent = newName;
            
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = 'Profile updated successfully!';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.remove();
                }, 3000);
            }, 100);
           
            closeModal();
        } else {
            alert('Please enter a valid name');
        }
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

function updateProfile(user) {
    const newName = document.getElementById('editName').value.trim();
    if (!newName) {
        alert('Please enter a valid name');
        return;
    }
    
    user.name = newName;
    localStorage.setItem('userData', JSON.stringify(user));
    
    document.getElementById('userName').textContent = newName;
    document.getElementById('userGreeting').textContent = `Welcome, ${newName}`;
    
    closeModal();
   
    alert('Profile updated successfully!');
}

function closeModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.remove();
    }
}
window.toggleBucketListItem = toggleBucketListItem;
window.deleteBucketListItem = deleteBucketListItem;
window.deleteNote = deleteNote;
