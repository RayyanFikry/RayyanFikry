// Form validation without using regular expressions

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });
        
        // Real-time validation
        this.addRealTimeValidation();
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }
    
    validateForm() {
        this.errors = {};
        
        // Get form data
        const formData = new FormData(this.form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Validate each field
        this.validateEmail(data.email);
        this.validateTitle(data.title);
        this.validateDescription(data.description);
        this.validateTags(data.tags);
        this.validateFile();
        this.validateAiGenerated(data.aiGenerated);
        
        // Display errors or submit
        if (Object.keys(this.errors).length === 0) {
            this.submitForm(data);
        } else {
            this.displayErrors();
        }
    }
    
    // Validation Type 1: Email validation (without regex)
    validateEmail(email) {
        if (!email) {
            this.errors.email = 'Email is required';
            return;
        }
        
        if (email.length < 5) {
            this.errors.email = 'Email is too short';
            return;
        }
        
        if (!email.includes('@')) {
            this.errors.email = 'Email must contain @ symbol';
            return;
        }
        
        if (!email.includes('.')) {
            this.errors.email = 'Email must contain a domain';
            return;
        }
        
        const atIndex = email.indexOf('@');
        const dotIndex = email.lastIndexOf('.');
        
        if (atIndex === 0) {
            this.errors.email = 'Email cannot start with @';
            return;
        }
        
        if (dotIndex <= atIndex + 1) {
            this.errors.email = 'Invalid email format';
            return;
        }
        
        if (dotIndex === email.length - 1) {
            this.errors.email = 'Email cannot end with a dot';
            return;
        }
    }
    
    // Validation Type 2: Title validation
    validateTitle(title) {
        if (!title) {
            this.errors.title = 'Title is required';
            return;
        }
        
        if (title.length < 3) {
            this.errors.title = 'Title must be at least 3 characters';
            return;
        }
        
        if (title.length > 100) {
            this.errors.title = 'Title must be less than 100 characters';
            return;
        }
        
        // Check for only spaces
        if (title.trim().length === 0) {
            this.errors.title = 'Title cannot be only spaces';
            return;
        }
    }
    
    // Validation Type 3: Description validation
    validateDescription(description) {
        if (!description) {
            this.errors.description = 'Description is required';
            return;
        }
        
        if (description.length < 10) {
            this.errors.description = 'Description must be at least 10 characters';
            return;
        }
        
        if (description.length > 1000) {
            this.errors.description = 'Description must be less than 1000 characters';
            return;
        }
        
        if (description.trim().length === 0) {
            this.errors.description = 'Description cannot be only spaces';
            return;
        }
        
        // Check for minimum word count
        const words = description.trim().split(' ').filter(word => word.length > 0);
        if (words.length < 3) {
            this.errors.description = 'Description must contain at least 3 words';
            return;
        }
    }
    
    // Validation Type 4: Tags validation
    validateTags(tags) {
        if (!tags) {
            this.errors.tags = 'At least one tag is required';
            return;
        }
        
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        
        if (tagArray.length === 0) {
            this.errors.tags = 'At least one valid tag is required';
            return;
        }
        
        if (tagArray.length > 10) {
            this.errors.tags = 'Maximum 10 tags allowed';
            return;
        }
        
        // Validate each tag
        for (let i = 0; i < tagArray.length; i++) {
            const tag = tagArray[i];
            if (tag.length < 2) {
                this.errors.tags = 'Each tag must be at least 2 characters';
                return;
            }
            if (tag.length > 20) {
                this.errors.tags = 'Each tag must be less than 20 characters';
                return;
            }
        }
        
        // Check for duplicate tags
        const uniqueTags = [...new Set(tagArray.map(tag => tag.toLowerCase()))];
        if (uniqueTags.length !== tagArray.length) {
            this.errors.tags = 'Duplicate tags are not allowed';
            return;
        }
    }
    
    // Validation Type 5: File validation
    validateFile() {
        const fileInput = this.form.querySelector('input[type="file"]');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            this.errors.file = 'Please upload an artwork file';
            return;
        }
        
        const file = fileInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
            this.errors.file = 'Only JPEG, PNG, GIF, and WebP files are allowed';
            return;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.errors.file = 'File size must be less than 10MB';
            return;
        }
        
        const minSize = 1024; // 1KB
        if (file.size < minSize) {
            this.errors.file = 'File size is too small';
            return;
        }
    }
    
    validateAiGenerated(aiGenerated) {
        if (!aiGenerated) {
            this.errors.aiGenerated = 'Please specify if the artwork is AI-generated';
            return;
        }
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        
        // Clear previous error
        delete this.errors[fieldName];
        
        // Validate based on field type
        switch (fieldName) {
            case 'email':
                this.validateEmail(value);
                break;
            case 'title':
                this.validateTitle(value);
                break;
            case 'description':
                this.validateDescription(value);
                break;
            case 'tags':
                this.validateTags(value);
                break;
        }
        
        // Display error for this field
        this.displayFieldError(field);
    }
    
    displayErrors() {
        // Clear all previous errors
        this.clearAllErrors();
        
        // Display new errors
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`) || 
                         this.form.querySelector(`input[type="file"]`);
            if (field) {
                this.displayFieldError(field);
            }
        });
    }
    
    displayFieldError(field) {
        const fieldName = field.name || 'file';
        const formGroup = field.closest('.form-group');
        
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class and message if there's an error
        if (this.errors[fieldName]) {
            formGroup.classList.add('error');
            field.style.borderColor = '#e74c3c';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<span style="color: #e74c3c;">⚠</span> ${this.errors[fieldName]}`;
            formGroup.appendChild(errorDiv);
        } else {
            formGroup.classList.remove('error');
            field.style.borderColor = '';
        }
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            field.style.borderColor = '';
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }
    
    clearAllErrors() {
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorGroups = this.form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => group.classList.remove('error'));
        
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    submitForm(data) {
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Simulate form submission
        setTimeout(() => {
            console.log('Form submitted with data:', data);
            
            // Show success message
            showSuccessMessage(
                'Submission Successful!',
                'Your artwork has been submitted for review. We\'ll notify you once it\'s approved.',
                'Submit Another Artwork'
            );
        }, 2000);
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize for submission form
    new FormValidator('submissionForm');
});

// File upload preview functionality
function initFileUpload() {
    const fileInput = document.querySelector('input[type="file"]');
    const fileUpload = document.querySelector('.file-upload');
    
    if (fileInput && fileUpload) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileName = file.name;
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                
                fileUpload.innerHTML = `
                    <div style="color: #22c55e; margin-bottom: 0.5rem;">✓</div>
                    <div><strong>Selected:</strong> ${fileName}</div>
                    <div style="color: #666; font-size: 0.9rem;">Size: ${fileSize} MB</div>
                    <div style="color: #8b5cf6; margin-top: 0.5rem; cursor: pointer;">Click to change file</div>
                `;
            }
        });
        
        // Drag and drop functionality
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#8b5cf6';
            this.style.background = '#f8f9ff';
        });
        
        fileUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
}

// Initialize file upload when DOM is loaded
document.addEventListener('DOMContentLoaded', initFileUpload);