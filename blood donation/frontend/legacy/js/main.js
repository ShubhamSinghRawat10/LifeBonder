
const cities = {
    "Andhra Pradesh": [
        "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
        "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam",
        "Vizianagaram", "West Godavari"
    ],
    "Arunachal Pradesh": [
        "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey",
        "Kra Daadi", "Lower Subansiri", "Upper Subansiri"
    ],
    "Assam": [
        "Baksa", "Barpeta", "Bongaigaon", "Cachar", "Charaideo",
        "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara",
        "Golaghat", "Hailakandi", "Jorhat", "Kamrup", "Karbi Anglong",
        "Kokrajhar"
    ],
    "Bihar": [
        "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai",
        "Bhagalpur", "Bhojpur", "Darbhanga", "Gaya", "Muzaffarpur",
        "Nalanda", "Patna", "Purnia", "Rohtas"
    ],
    "Delhi": [
        "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
        "North East Delhi", "South Delhi", "West Delhi"
    ],
    "Uttarakhand": [
        "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun",
        "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh",
        "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
    ],
    "West Bengal": [
        "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Darjeeling",
        "Hooghly", "Howrah", "Jalpaiguri", "Kolkata", "Murshidabad",
        "Nadia", "Purba Medinipur", "South 24 Parganas", "West Medinipur"
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const citySelects = document.querySelectorAll('#city, #donate-city');
    
    citySelects.forEach(citySelect => {
        if (citySelect) {
        
            for (const [state, cityList] of Object.entries(cities)) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = state;
                
                cityList.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    optgroup.appendChild(option);
                });
                
                citySelect.appendChild(optgroup);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const city = document.getElementById('city').value;
            const bloodGroup = document.getElementById('blood_group').value;
            
            if (!city) {
                e.preventDefault();
                alert('Please select a city');
            }
            
            if (!bloodGroup) {
                e.preventDefault();
                alert('Please select a blood group');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation.split('/').pop()) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
}); 