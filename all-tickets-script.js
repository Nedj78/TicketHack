// 1. FONCTION EXECUTÉE LORSQUE LE CONTENU DE LA PAGE EST CHARGÉ
document.addEventListener('DOMContentLoaded', async function () {
    showLoadingIcon();  
    await getAllTicketsWithDelay(); 
    hideLoadingIcon();  
});

// Fonction pour afficher l'icône de chargement
function showLoadingIcon() {
    const loadingIcon = document.querySelector('#loading_icon');
    loadingIcon.style.display = 'block';
}

// Fonction pour masquer l'icône de chargement
function hideLoadingIcon() {
    const loadingIcon = document.querySelector('#loading_icon');
    loadingIcon.style.display = 'none';
}

// Fonction pour masquer tous les billets
function hideTickets() {
    const tripCards = document.querySelectorAll('.trip-card');
    tripCards.forEach(tripCard => {
        tripCard.style.display = 'none';
    });
}

// 2. FONCTION POUR RECUPERER TOUS LES BILLETS EXISTANTS AVEC UN DÉLAI DE 5 SEC
async function getAllTicketsWithDelay() {
    await new Promise(resolve => setTimeout(resolve, 5000));    
    hideTickets();  // Après le délai, cacher tous les billets avant de récupérer les données

    try {
        await getAllTickets(); // Récupérer tous les billets de train
    } catch (error) {
        throw error;  // En cas d'erreur, rejeter la promesse
    }
}

// 3. FONCTION POUR RECUPERER TOUS LES BILLETS EXISTANTS
async function getAllTickets() {
    try {
        const fetchResponse = await fetch('http://localhost:3000/tickets'); // Requête d'envoi au serveur

        const data = await fetchResponse.json(); // Réponse du serveur avec les données en json

        if (data.tickets) { // Vérifie si des billets sont disponibles dans les données récupérées
            data.tickets.forEach(ticket => { // Parcourt tous les billets et les affiche sur la page
                // Formatage de la date et de l'heure du billet qui sera affiché
                const arrivalCity = ticket.arrival[0].toUpperCase() + ticket.arrival.slice(1);
                const departureCity = ticket.departure[0].toUpperCase() + ticket.departure.slice(1);
                const dateTicket = new Date(ticket.date);

                let hourTicket = String(dateTicket.getHours()) % 12;
                hourTicket = hourTicket === 0 ? 12 : hourTicket;
                const minuteTicket = String(dateTicket.getMinutes()).padStart(2, '0');
                let dayTicket = String(dateTicket.getDate()).padStart(2, '0');
                let monthTicket = String(dateTicket.getMonth() + 1).padStart(2, '0');
                const yearTicket = dateTicket.getFullYear();

                let meridiem = 'am';
                if (dateTicket.getHours() >= 12) {
                    meridiem = 'pm';
                }
                const formattedDate = `${dayTicket}/${monthTicket}/${yearTicket} at ${hourTicket}:${minuteTicket} ${meridiem}`;

                // Ajoute le billet au contenu affiché de la page
                document.querySelector('.content-dashboard').innerHTML += `
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
                    </div>`;
            });
        }
    } catch (error) {
        // Gestion des erreurs lors de la récupération des billets
        console.error('Error:', error);
        throw error;
    }
}
