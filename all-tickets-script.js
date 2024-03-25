// Fonction exécutée lorsque le contenu de la page est chargé
document.addEventListener('DOMContentLoaded', async function () {
    showLoadingIcon();   // Affiche l'icône de chargement
    await getAllTicketsWithDelay();    // Attend la récupération de tous les billets avec un délai de 3 secondes
    hideLoadingIcon();    // Cache l'icône de chargement après la récupération des billets
});

// Fonction pour afficher l'icône de chargement
function showLoadingIcon() {
    const loadingIcon = document.querySelector('#loading_icon');
    loadingIcon.style.display = 'block';
}

// Fonction pour cacher l'icône de chargement
function hideLoadingIcon() {
    const loadingIcon = document.querySelector('#loading_icon');
    loadingIcon.style.display = 'none';
}

// Fonction pour cacher tous les billets
function hideTickets() {
    const tripCards = document.querySelectorAll('.trip-card');
    tripCards.forEach(tripCard => {
        tripCard.style.display = 'none';
    });
}

// Fonction pour récupérer tous les billets avec un délai de 3 secondes
async function getAllTicketsWithDelay() {
    await new Promise(resolve => setTimeout(resolve, 3000));    
    hideTickets();   // Après le délai, cacher tous les billets avant de récupérer les données

    try {
        await getAllTickets();   // Récupérer tous les billets de train
    } catch (error) {
        throw error;   // En cas d'erreur, rejeter la promesse
    }
}

// Fonction asynchrone pour récupérer toutes les villes de départ et d'arrivée
async function getAllTickets() {
    try {
        const fetchResponse = await fetch('http://localhost:3000/tickets');    // Envoie une requête au serveur pour récupérer tous les billets disponibles

        const data = await fetchResponse.json();    // Récupère les données JSON de la réponse

        // Vérifie si des billets sont disponibles dans les données récupérées
        if (data.tickets) {
            data.tickets.forEach(ticket => {     // Parcourt tous les billets et les affiche sur la page
                // Formatage de la date et de l'heure du billet
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

                // Ajoute le billet au contenu de la page
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
