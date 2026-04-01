
document.addEventListener('DOMContentLoaded', async function() {
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
        try {
            const stateList = await window.API.getStates();
            stateList.forEach(function(state) {
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
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const donorsList = document.getElementById('donorsList');
    
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = searchForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...';
            }
            
            const formData = new FormData(this);
            const searchData = Object.fromEntries(formData.entries());
            
            try {
                const results = await window.API.searchDonors(searchData);
                if (Array.isArray(results) && results.length > 0) {
                    displayDonors(results.map(function(d) {
                        return {
                            name: d.name || d.fullName || 'Donor',
                            bloodGroup: d.bloodGroup || d.blood_group,
                            age: d.age,
                            city: d.city,
                            state: d.state,
                            lastDonation: d.lastDonation || d.last_donation,
                            contact: d.contact || d.phone
                        };
                    }));
                    searchResults.style.display = 'block';
                    noResults.style.display = 'none';
                } else {
                    donorsList.innerHTML = '';
                    searchResults.style.display = 'none';
                    noResults.style.display = 'block';
                }
            } catch (err) {
                console.error(err);
                donorsList.innerHTML = '';
                searchResults.style.display = 'none';
                noResults.style.display = 'block';
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Search Donors';
                }
            }
        });
    }
});

function displayDonors(donors) {
    const donorsList = document.getElementById('donorsList');
    donorsList.innerHTML = '';
    
    donors.forEach(donor => {
        const donorCard = createDonorCard(donor);
        donorsList.appendChild(donorCard);
    });
}

function createDonorCard(donor) {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'card h-100';
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const lastDonation = donor.lastDonation ? new Date(donor.lastDonation) : new Date();
    const today = new Date();
    const monthsSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24 * 30));
    
    cardBody.innerHTML = `
        <h5 class="card-title">${donor.name}</h5>
        <p class="card-text">
            <strong>Blood Group:</strong> ${donor.bloodGroup}<br>
            <strong>Age:</strong> ${donor.age}<br>
            <strong>Location:</strong> ${donor.city}, ${donor.state}<br>
            <strong>Last Donation:</strong> ${monthsSinceLastDonation} months ago
        </p>
        <button class="btn btn-danger" onclick="contactDonor('${donor.contact}')">
            Contact Donor
        </button>
    `;
    
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}

function contactDonor(contact) {
   
    alert(`Contact number: ${contact}\n\nPlease note: In a real application, this would initiate a secure contact process.`);
}
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('button[type="submit"]');
    const searchForm = document.getElementById('searchForm');
    
    if (searchButton && searchForm) {
        searchForm.addEventListener('submit', function() {
            searchButton.disabled = true;
            searchButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...';
            
            setTimeout(() => {
                searchButton.disabled = false;
                searchButton.innerHTML = 'Search Donors';
            }, 1000);
        });
    }
}); 