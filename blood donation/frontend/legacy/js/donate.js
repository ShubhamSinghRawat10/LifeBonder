
document.addEventListener('DOMContentLoaded', async function() {
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
        try {
            const states = await window.API.getStates();
            states.forEach(function(state) {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateSelect.appendChild(option);
            });
        } catch (e) {
            console.error('Failed to load states', e);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    
    if (stateSelect && citySelect) {
        stateSelect.addEventListener('change', async function() {
            citySelect.innerHTML = '<option value="">Select City</option>';
            const selectedState = this.value;
            if (!selectedState) return;
            try {
                const citiesList = await window.API.getCities(selectedState);
                citiesList.forEach(function(city) {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            } catch (e) {
                console.error('Failed to load cities', e);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const donorForm = document.getElementById('donorForm');
    
    if (donorForm) {
        donorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = donorForm.querySelector('button[type="submit"]');
            
            const formData = new FormData(this);
            const donorData = Object.fromEntries(formData.entries());
            
            const age = parseInt(donorData.age);
            if (age < 18 || age > 65) {
                alert('Age must be between 18 and 65 years');
                return;
            }
            
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(donorData.phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(donorData.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (donorData.last_donation) {
                const lastDonation = new Date(donorData.last_donation);
                const today = new Date();
                const monthsSinceLastDonation = (today - lastDonation) / (1000 * 60 * 60 * 24 * 30);
                if (monthsSinceLastDonation < 3) {
                    alert('You must wait at least 3 months between donations');
                    return;
                }
            }
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';
            }
            
            try {
                await window.API.registerDonor(donorData);
                alert('Thank you for registering as a donor! We will contact you soon.');
                donorForm.reset();
            } catch (err) {
                console.error(err);
                alert('Registration failed. Please try again later.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Register as Donor';
                }
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
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
