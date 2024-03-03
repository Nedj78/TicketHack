document.addEventListener('DOMContentLoaded', function () {
    getAllCities();
});

function getAllCities() {
    fetch('http://localhost:3000/tickets')
        .then(response => response.json())
        .then(data => {
            if (data.tickets) {
                data.tickets.forEach(ticket => {
                    const arrivalCity = ticket.arrival[0].toUpperCase() + ticket.arrival.slice(1);
                    const departureCity = ticket.departure[0].toUpperCase() + ticket.departure.slice(1);
                    const dateTicket = new Date(ticket.date);
                    
                    const hourTicket = String(dateTicket.getHours()).padStart(2, '0');
                    const minuteTicket = String(dateTicket.getMinutes()).padStart(2, '0');
                    let dayTicket = String(dateTicket.getDate()).padStart(2, '0');
                    let monthTicket = String(dateTicket.getMonth() + 1).padStart(2, '0');

                    if (dateTicket.getMonth() + 1 > 9) {
                        monthTicket = String(dateTicket.getMonth() + 1).padStart(2, '0');
                    }
                    
                    if (dateTicket.getDate() > 0 && dateTicket.getDate() < 10) {
                        dayTicket = String(dateTicket.getDate()).padStart(2, '0');
                    }

                    const yearTicket = dateTicket.getFullYear();
                    const formattedDate = `${dayTicket}/${monthTicket}/${yearTicket} at ${hourTicket}:${minuteTicket}`;

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
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
