// Déclaration du bouton de recherche
const searchButton = document.querySelector('.btn-search');

// Ecouteur d'événements pour le clic sur le bouton de recherche de billets
searchButton.addEventListener('click', fetchTickets);

// Un tableau pour stocker les billets affichés sur la page
const ticketsList = [];

// 1. FONCTION POUR CREER ET AFFICHER UN NOUVEAU BILLET SUR LA PAGE
function createTicket(ticket) {
    const arrivalCity = ticket.arrival[0].toUpperCase() + ticket.arrival.slice(1);
    const departureCity = ticket.departure[0].toUpperCase() + ticket.departure.slice(1);
    const dateTicket = new Date(ticket.date);

    const hourTicket = String(dateTicket.getHours()) % 12;
    const minuteTicket = String(dateTicket.getMinutes()).padStart(2, '0');
    let formattedDate = `${hourTicket}:${minuteTicket}`;

    // Ajout du suffixe 'am' ou 'pm' en fonction de l'heure de la journée
    if (dateTicket.getHours() > 0 && dateTicket.getHours() < 11 ) {
        formattedDate = `${hourTicket}:${minuteTicket} am`;
    } else {
        formattedDate = `${hourTicket}:${minuteTicket} pm`;
    }

    // Sélection de l'élément où les billets seront ajoutés
    const tripCard = document.querySelector('#content-right');

    // Vérification si le billet est déjà affiché pour éviter les doublons et cumuls d'affichage de billets
    const isTicketListDisplayed = ticketsList.some(ticketsList => {
        return ticketsList.arrival === arrivalCity &&
               ticketsList.departure === departureCity &&
               ticketsList.date === formattedDate &&
               ticketsList.price === ticket.price;
    });

    // Si le billet n'est pas déjà affiché, il est ajouté à la page et au tableau
    if (!isTicketListDisplayed) {
        tripCard.innerHTML += `
          <div class="trip-card">
            <div class="trip">
                <div>
                    <span class="city-departure">${departureCity}</span>
                    <span>&nbsp;&rsaquo;&nbsp;</span>
                    <span class="city-arrival">${arrivalCity}</span>
                </div>
                    <span class="date">${formattedDate}</span>
                    <span class="amount"><span class="currency">${ticket.price}&nbsp;€</span></span>
            </div>
          </div>
        `;
        ticketsList.push(ticket);
    }
}

// 2. FONCTION ASYNCHRONE POUR RECUPERER LES BILLETS DEPUIS LE SERVEUR 
async function fetchTickets() {
    const tripCard = document.querySelector('#content-right');

    const departure = document.querySelector('#departure-input').value; 
    const arrival = document.querySelector('#arrival-input').value; 
    const date = document.querySelector('#date-input').value;
    
    let inputFields = document.querySelectorAll('#departure-input, #arrival-input, #date-input');
    let optionOne = document.querySelector('#option-one');
    let errorMessage = document.querySelector('#error-message');

    // Nettoyage de l'affichage précédent et du tableau de billets
    tripCard.innerHTML = '';
    ticketsList.length = 0;

    // Désactivation du bouton de recherche pendant la requête
    searchButton.disabled = true; 

    // Vérification de la saisie utilisateur et affichage d'un message d'erreur si nécessaire
    if (departure === '' || arrival === '' || date === '') {
        errorMessage.textContent = 'All fields are required';
        inputFields.forEach(field => {
            field.style.border = '1.5px solid red';
        });
        // Affichage d'une carte d'affichage par défaut si des champs sont vides
        tripCard.innerHTML = `
        <div id="option-one">
            <div class="default-card">
                <div>
                    <img src="./train-tram-solid.svg" alt="train_logo" height="80px" width="80px" />
                    <div class="green-line"></div>
                    <p class="msg-default-card">It's time to book your future ticket trip.</p>
                </div>
            </div>
        </div>
        `;
        searchButton.disabled = false;
        return;
    } else {
        // Réinitialisation de l'affichage et des styles en cas de saisie correcte des trois champs de formulaire
        tripCard.innerHTML = '';
        errorMessage.textContent = ''; 
        inputFields.forEach(field => {
            field.style.border = 'none';
            if (field === document.querySelector('#departure-input')) {
                field.style.borderBottom = 'solid rgb(195, 194, 194)';
            } 
        });
    }

    try {
        // Envoi d'une requête au serveur pour récupérer les billets disponibles en lien avec la requête
        const responseToFetch = await fetch('http://localhost:3000/tickets/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ departure, arrival, date })
        });

        // Gestion de la réponse du serveur
        if (!responseToFetch.ok) {
            // Echec
            tripCard.innerHTML = '';
            tripCard.innerHTML += `
                <div class="notrip-card">
                    <div>
                        <img src="./not_found.png" alt="trip_not_found" height="80px" width="80px" />
                        <div class="green-line"></div>
                        <p class="msg-notrip-card">No trip found.</p>
                    </div>
                </div>`;
            throw new Error('Request failed!')
        }

        // Récupération des données JSON de la réponse
        const data = await responseToFetch.json();

        // Réinitialisation de l'affichage initial et affichage des billets récupérés sur la page
        tripCard.innerHTML = '';
        data.tickets.forEach(ticket => {
            createTicket(ticket);
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
    } finally {
        // Réactivation du bouton de recherche et nettoyage des champs de saisie
        searchButton.disabled = false;
        document.querySelectorAll('#departure-input, #arrival-input, #date-input').forEach(input => {
            input.value = '';
        });
    }
}