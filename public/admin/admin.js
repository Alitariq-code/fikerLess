// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.internships = [];
        this.currentInternship = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkAuth();
        await this.loadDashboardData();
        
        // Load internships data immediately
        await this.loadInternships();
        
        // Check if we should show a specific tab based on URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab') || localStorage.getItem('activeTab') || 'dashboard';
        this.showTab(tab);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.dataset.tab;
                this.showTab(tab);
            });
        });

        // Mobile menu
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('-translate-x-full');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Modal controls
        document.getElementById('addInternshipBtn').addEventListener('click', () => {
            this.openModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('internshipForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveInternship();
        });

        // Dynamic form controls
        document.getElementById('addProgramBtn').addEventListener('click', () => {
            this.addProgramField();
        });

        document.getElementById('addIncludeBtn').addEventListener('click', () => {
            this.addIncludeField();
        });

        // Search and filter
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.filterInternships(e.target.value);
        });

        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filterInternships(document.getElementById('searchInput').value, e.target.value);
        });
    }

    async checkAuth() {
        try {
            const response = await fetch('/api/admin/check-auth', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (!data.success || !data.authenticated) {
                window.location.href = '/admin/login';
                return;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/admin/login';
        }
    }

    async logout() {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/admin/login';
        }
    }

    showTab(tabName) {
        // Save active tab
        localStorage.setItem('activeTab', tabName);
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'bg-blue-600', 'text-white');
            link.classList.add('text-gray-300');
        });

        const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'bg-blue-600', 'text-white');
            activeLink.classList.remove('text-gray-300');
        }

        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
            activeContent.classList.add('fade-in');
        }

        // Ensure internships are rendered if switching to internships tab
        if (tabName === 'internships' && this.internships.length > 0) {
            this.renderInternships();
        }
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/api/admin/stats', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                const stats = data.data;
                document.getElementById('totalInternships').textContent = stats.totalInternships;
                document.getElementById('activeInternships').textContent = stats.activeInternships;
                document.getElementById('totalMentors').textContent = stats.totalMentors;
                document.getElementById('totalCities').textContent = stats.totalCities;
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }


    async loadInternships() {
        this.showLoading();
        try {
            const response = await fetch('/api/admin/internships', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                this.internships = data.data;
                this.renderInternships();
                await this.loadDashboardData(); // Refresh stats after loading internships
            }
        } catch (error) {
            console.error('Failed to load internships:', error);
            this.showNotification('Failed to load internships', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderInternships(internships = this.internships) {
        const container = document.getElementById('internshipsList');
        
        if (internships.length === 0) {
            container.innerHTML = `
                <div class="glass-card rounded-2xl p-8 text-center">
                    <i class="fas fa-graduation-cap text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No internships found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = internships.map(internship => `
            <div class="glass-card rounded-2xl p-6 admin-card">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${internship.mentorName}</h3>
                        <p class="text-gray-600">${internship.profession}</p>
                        <p class="text-sm text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i>${internship.city}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${internship.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${internship.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-600 mb-2">Programs: ${internship.programs.length}</p>
                        <div class="space-y-1">
                            ${internship.programs.slice(0, 2).map(program => `
                                <div class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    ${program.title} - ${program.duration} - ₨${program.fees}
                                </div>
                            `).join('')}
                            ${internship.programs.length > 2 ? `<div class="text-xs text-gray-500">+${internship.programs.length - 2} more</div>` : ''}
                        </div>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-2">Includes: ${internship.includes.length} items</p>
                        <div class="text-xs text-gray-500">
                            ${internship.includes.slice(0, 3).join(', ')}
                            ${internship.includes.length > 3 ? '...' : ''}
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-2">
                    <button data-action="edit" data-id="${internship._id}" class="action-btn btn-primary px-4 py-2 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button data-action="toggle" data-id="${internship._id}" class="action-btn btn-warning px-4 py-2 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-toggle-${internship.isActive ? 'off' : 'on'} mr-1"></i>
                        ${internship.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button data-action="delete" data-id="${internship._id}" class="action-btn btn-danger px-4 py-2 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for action buttons
        this.setupActionButtonListeners();
        
        // Ensure cards remain visible immediately and continuously
        this.ensureCardsVisibility();
        
        // Force visibility after a short delay to handle any async issues
        setTimeout(() => {
            this.forceCardsVisible();
        }, 100);
    }
    
    forceCardsVisible() {
        const cards = document.querySelectorAll('.admin-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.transform = 'none';
        });
    }
    
    ensureCardsVisibility() {
        // Immediate fix for any hidden cards
        this.forceCardsVisible();
        
        // Monitor admin cards and ensure they stay visible
        const observer = new MutationObserver(() => {
            this.forceCardsVisible();
        });
        
        const container = document.getElementById('internshipsList');
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        
        // Also check periodically
        setInterval(() => {
            this.forceCardsVisible();
        }, 1000);
    }
    
    setupActionButtonListeners() {
        const container = document.getElementById('internshipsList');
        if (!container) return;
        
        // Remove any existing listeners to avoid duplicates
        const existingListener = container.getAttribute('data-listener');
        if (existingListener) return;
        
        // Mark that we've added a listener
        container.setAttribute('data-listener', 'true');
        
        // Use event delegation for better performance
        container.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const action = actionBtn.getAttribute('data-action');
            const id = actionBtn.getAttribute('data-id');
            
            // Add smooth visual feedback
            actionBtn.style.transform = 'scale(0.95)';
            actionBtn.style.transition = 'transform 0.1s ease';
            setTimeout(() => {
                actionBtn.style.transform = 'scale(1)';
            }, 100);
            
            // Execute the appropriate action
            switch (action) {
                case 'edit':
                    this.editInternship(id);
                    break;
                case 'toggle':
                    this.toggleInternshipStatus(id);
                    break;
                case 'delete':
                    this.deleteInternship(id);
                    break;
                default:
                    this.showNotification('Invalid action requested', 'error');
            }
        });
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

    filterInternships(search = '', status = '') {
        let filtered = this.internships;

        if (search) {
            const searchLower = search.toLowerCase();                                                                   
            filtered = filtered.filter(internship => 
                internship.mentorName.toLowerCase().includes(searchLower) ||
                internship.profession.toLowerCase().includes(searchLower) ||
                internship.city.toLowerCase().includes(searchLower) ||
                internship.includes.some(item => item.toLowerCase().includes(searchLower))
            );
        }

        if (status !== '') {
            const isActive = status === 'true';
            filtered = filtered.filter(internship => internship.isActive === isActive);
        }

        this.renderInternships(filtered);
    }

    openModal(internship = null) {
        this.currentInternship = internship;
        const modal = document.getElementById('internshipModal');
        const title = document.getElementById('modalTitle');
        
        if (internship) {
            title.textContent = 'Edit Internship';
            this.populateForm(internship);
        } else {
            title.textContent = 'Add New Internship';
            this.resetForm();
        }
        
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('internshipModal');
        modal.classList.remove('show');
        this.currentInternship = null;
    }

    resetForm() {
        document.getElementById('internshipForm').reset();
        document.getElementById('internshipId').value = '';
        document.getElementById('isActive').checked = true;
        document.getElementById('sortOrder').value = '0';
        
        // Reset dynamic fields
        document.getElementById('programsList').innerHTML = '';
        document.getElementById('includesList').innerHTML = '';
        
        // Add default program and include
        this.addProgramField();
        this.addIncludeField();
    }

    populateForm(internship) {
        document.getElementById('internshipId').value = internship._id;
        document.getElementById('mentorName').value = internship.mentorName;
        document.getElementById('profession').value = internship.profession;
        document.getElementById('specialization').value = internship.specialization || '';
        document.getElementById('city').value = internship.city;
        document.getElementById('cityNote').value = internship.cityNote || '';
        document.getElementById('additionalInfo').value = internship.additionalInfo || '';
        document.getElementById('isActive').checked = internship.isActive;
        document.getElementById('sortOrder').value = internship.sortOrder || 0;

        // Populate programs
        const programsList = document.getElementById('programsList');
        programsList.innerHTML = '';
        internship.programs.forEach(program => {
            this.addProgramField(program);
        });

        // Populate includes
        const includesList = document.getElementById('includesList');
        includesList.innerHTML = '';
        internship.includes.forEach(include => {
            this.addIncludeField(include);
        });
    }

    addProgramField(program = null) {
        const programsList = document.getElementById('programsList');
        const programId = Date.now() + Math.random();
        
        const programDiv = document.createElement('div');
        programDiv.className = 'program-card border border-gray-200 rounded-2xl p-6 space-y-4 shadow-lg';
        programDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <h5 class="font-semibold text-gray-800 flex items-center">
                    <i class="fas fa-graduation-cap text-green-600 mr-2"></i>
                    Program ${programsList.children.length + 1}
                </h5>
                <button type="button" class="remove-program-btn text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="form-field">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-tag text-green-500 mr-1"></i>
                        Title *
                    </label>
                    <input type="text" name="programTitle" value="${program?.title || ''}" required 
                           placeholder="e.g., Basic Training"
                           class="input-focus w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300">
                </div>
                <div class="form-field">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-clock text-green-500 mr-1"></i>
                        Duration *
                    </label>
                    <input type="text" name="programDuration" value="${program?.duration || ''}" required 
                           placeholder="e.g., 3 months"
                           class="input-focus w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300">
                </div>
                <div class="form-field">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-money-bill text-green-500 mr-1"></i>
                        Fees (PKR) *
                    </label>
                    <input type="number" name="programFees" value="${program?.fees || ''}" required min="0"
                           placeholder="0 for free"
                           class="input-focus w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300">
                </div>
                <div class="form-field">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-laptop text-green-500 mr-1"></i>
                        Mode
                    </label>
                    <select name="programMode" class="input-focus w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300">
                        <option value="online" ${program?.mode === 'online' ? 'selected' : ''}>🌐 Online</option>
                        <option value="offline" ${program?.mode === 'offline' ? 'selected' : ''}>🏢 Offline</option>
                        <option value="hybrid" ${program?.mode === 'hybrid' ? 'selected' : ''}>🔄 Hybrid</option>
                    </select>
                </div>
            </div>
            <div class="form-field">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-align-left text-green-500 mr-1"></i>
                    Description
                </label>
                <textarea name="programDescription" rows="2" 
                          placeholder="Brief description of the program..."
                          class="input-focus w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300">${program?.description || ''}</textarea>
            </div>
        `;
        
        // Add event listener for the remove button
        const removeBtn = programDiv.querySelector('.remove-program-btn');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if this is the last program field
            const programsList = document.getElementById('programsList');
            const programCount = programsList.querySelectorAll('.program-card').length;
            
            if (programCount <= 1) {
                this.showNotification('At least one program is required', 'error');
                return;
            }
            
            // Add smooth fade out animation
            programDiv.style.opacity = '0';
            programDiv.style.transform = 'scale(0.95) translateY(-10px)';
            programDiv.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                programDiv.remove();
                this.updateProgramNumbers();
                this.showNotification('Program removed successfully', 'success');
            }, 400);
        });
        
        programsList.appendChild(programDiv);
    }
    
    // Helper method to update program numbers after removal
    updateProgramNumbers() {
        const programsList = document.getElementById('programsList');
        const programCards = programsList.querySelectorAll('.program-card');
        
        programCards.forEach((card, index) => {
            const title = card.querySelector('h5');
            if (title) {
                title.innerHTML = `
                    <i class="fas fa-graduation-cap text-green-600 mr-2"></i>
                    Program ${index + 1}
                `;
            }
        });
    }

    addIncludeField(value = '') {
        const includesList = document.getElementById('includesList');
        
        const includeDiv = document.createElement('div');
        includeDiv.className = 'flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-purple-100 hover:border-purple-300 transition-all duration-300';
        includeDiv.innerHTML = `
            <i class="fas fa-check-circle text-purple-500"></i>
            <input type="text" name="includes" value="${value}" placeholder="e.g., CBT, DBT, Assessment" 
                   class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300">
            <button type="button" class="remove-include-btn text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add event listener for the remove button
        const removeBtn = includeDiv.querySelector('.remove-include-btn');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add smooth slide out animation
            includeDiv.style.opacity = '0';
            includeDiv.style.transform = 'translateX(-30px) scale(0.95)';
            includeDiv.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                includeDiv.remove();
                this.showNotification('Include item removed', 'success');
            }, 400);
        });
        
        includesList.appendChild(includeDiv);
    }

    async saveInternship() {
        const form = document.getElementById('internshipForm');
        const formData = new FormData(form);
        const saveBtn = document.getElementById('saveBtn');
        const saveText = document.getElementById('saveText');
        
        // Validate required fields
        const mentorName = document.getElementById('mentorName').value.trim();
        const profession = document.getElementById('profession').value.trim();
        const city = document.getElementById('city').value.trim();
        
        if (!mentorName) {
            this.showNotification('❌ Mentor name is required', 'error');
            document.getElementById('mentorName').focus();
            return;
        }
        
        if (!profession) {
            this.showNotification('❌ Profession is required', 'error');
            document.getElementById('profession').focus();
            return;
        }
        
        if (!city) {
            this.showNotification('❌ City is required', 'error');
            document.getElementById('city').focus();
            return;
        }
        
        // Collect programs
        const programs = [];
        const programTitles = formData.getAll('programTitle');
        const programDurations = formData.getAll('programDuration');
        const programFees = formData.getAll('programFees');
        const programModes = formData.getAll('programMode');
        const programDescriptions = formData.getAll('programDescription');
        
        for (let i = 0; i < programTitles.length; i++) {
            const title = programTitles[i]?.trim();
            const duration = programDurations[i]?.trim();
            const fees = parseInt(programFees[i]) || 0;
            
            if (title && duration) {
                programs.push({
                    title: title,
                    duration: duration,
                    fees: fees,
                    mode: programModes[i] || 'online',
                    description: programDescriptions[i]?.trim() || ''
                });
            }
        }
        
        if (programs.length === 0) {
            this.showNotification('❌ At least one program is required', 'error');
            return;
        }

        // Collect includes
        const includes = formData.getAll('includes')
            .map(item => item?.trim())
            .filter(item => item && item.length > 0);

        const internshipData = {
            mentorName: mentorName,
            profession: profession,
            specialization: document.getElementById('specialization').value.trim() || '',
            city: city,
            cityNote: document.getElementById('cityNote').value.trim() || 'Student can be debuted across multiple cities (depends on city)',
            additionalInfo: document.getElementById('additionalInfo').value.trim() || '',
            isActive: document.getElementById('isActive').checked,
            sortOrder: parseInt(document.getElementById('sortOrder').value) || 0,
            programs: programs,
            includes: includes
        };

        // Show beautiful loading state
        saveBtn.disabled = true;
        saveBtn.classList.add('opacity-75', 'cursor-not-allowed');
        saveText.innerHTML = '<div class="spinner mr-2"></div>Saving...';

        try {
            const internshipId = document.getElementById('internshipId').value;
            const url = internshipId ? `/api/admin/internships/${internshipId}` : '/api/admin/internships';
            const method = internshipId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(internshipData),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(data.message, 'success');
                this.closeModal();
                await this.loadInternships();
            } else {
                this.showNotification(data.message || 'Failed to save internship', 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('Network error occurred', 'error');
        } finally {
            // Reset loading state with smooth transition
            saveBtn.disabled = false;
            saveBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            saveText.innerHTML = '<i class="fas fa-save mr-2"></i>Save Internship';
        }
    }

    async editInternship(id) {
        const internship = this.internships.find(i => i._id === id);
        if (internship) {
            this.openModal(internship);
        } else {
            this.showNotification('Internship not found', 'error');
        }
    }

    async toggleInternshipStatus(id) {
        try {
            const response = await fetch(`/api/admin/internships/${id}/toggle`, {
                method: 'PATCH',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(data.message, 'success');
                await this.loadInternships();
            } else {
                this.showNotification(data.message || 'Failed to toggle status', 'error');
            }
        } catch (error) {
            this.showNotification('Network error occurred', 'error');
        }
    }

    async deleteInternship(id) {
        if (!confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/internships/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(data.message, 'success');
                await this.loadInternships();
            } else {
                this.showNotification(data.message || 'Failed to delete internship', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showNotification('Network error occurred', 'error');
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transform = 'scale(0.9)';
        loadingOverlay.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            loadingOverlay.style.opacity = '1';
            loadingOverlay.style.transform = 'scale(1)';
        });
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 300);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl backdrop-blur-sm transition-all duration-500 transform translate-x-full ${
            type === 'success' ? 'bg-green-50/90 text-green-800 border border-green-200/50' :
            type === 'error' ? 'bg-red-50/90 text-red-800 border border-red-200/50' :
            'bg-blue-50/90 text-blue-800 border border-blue-200/50'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-xl">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </div>
                <span class="font-medium">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove with animation
        setTimeout(() => {
            notification.style.transform = 'translateX(100%) scale(0.9)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// Initialize admin panel when DOM is ready
let adminPanel;

function initializeAdminPanel() {
    adminPanel = new AdminPanel();
    
    // Additional safeguard - force visibility of any cards after initialization
    setTimeout(() => {
        const cards = document.querySelectorAll('.admin-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.display = 'block';
            card.style.visibility = 'visible';
        });
    }, 500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminPanel);
} else {
    initializeAdminPanel();
}

// Production error handling
window.addEventListener('error', (e) => {
    adminPanel.showNotification('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    adminPanel.showNotification('Network error occurred', 'error');
});
