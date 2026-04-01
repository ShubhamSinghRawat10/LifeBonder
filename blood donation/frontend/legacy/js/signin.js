
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = signinForm.querySelector('button[type="submit"]');
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            const remember = formData.get('remember') === 'on';
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...';
            }
            
            try {
                const result = await window.API.signIn({ email: email, password: password });
           
                if (remember) {
                    localStorage.setItem('userEmail', email);
                } else {
                    sessionStorage.setItem('userEmail', email);
                }
            
                if (result && result.token) {
                    sessionStorage.setItem('authToken', result.token);
                }
                showSuccess('Sign in successful! Redirecting...');
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (err) {
                console.error(err);
                showError('Invalid email or password or network error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Sign In';
                }
            }
        });
    }
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.textContent = message;
    
    const form = document.getElementById('signinForm');
    form.insertAdjacentElement('beforebegin', errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.textContent = message;
    
    const form = document.getElementById('signinForm');
    form.insertAdjacentElement('beforebegin', successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');
    
    if (emailInput && rememberCheckbox) {
        const rememberedEmail = localStorage.getItem('userEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', function() {
            this.classList.add('is-invalid');
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
}); 