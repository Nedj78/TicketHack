function createTicket(ticket) {
    const arrivalCity = ticket.arrival[0].toUpperCase() + ticket.arrival.slice(1);
    const departureCity = ticket.departure[0].toUpperCase() + ticket.departure.slice(1);
    const dateTicket = new Date(ticket.date);

    const hourTicket = dateTicket.getHours().toString().padStart(2, '0');
    const minuteTicket = dateTicket.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${hourTicket}:${minuteTicket}`;

    const tripCard = document.querySelector('#content-right');

    tripCard.innerHTML += `
      <div class="trip-card">
        <div class="trip">
            <div>
                <span class="city-departure">${departureCity}</span>
                <span>&nbsp;&rsaquo;&nbsp;</span>
                <span class="city-arrival">${arrivalCity}</span>
            </div>
                <span class="date">${formattedDate}</span>
                <span class="amount"><span class="currency">${ticket.price}€</span></span>
        </div>
      </div>
    `;
}

const fetchTickets = async () => {
    console.log('coucou')
    const departure = document.querySelector('#departure-input').value; 
    const arrival = document.querySelector('#arrival-input').value; 
    const date = document.querySelector('#date-input').value;
    console.log(date);

    const optionOne = document.querySelector('#option-one');
    const optionTwo = document.querySelector('#option-two');
    const optionThree = document.querySelector('#option-three');

    fetch('http://localhost:3000/tickets/search', {
        method: 'POST',
         headers: {'Content-Type':'application/json'},
         body: JSON.stringify({
            departure, 
            arrival,
            date
        })
    })

    .then(data => {
        console.log('la réponse:', data)
        if (!data.ok) {
            optionOne.style.display = "none";
            optionThree.style.display = "none";
            optionTwo.innerHTML = `
                <div class="notrip-card">
                    <div>
                        <img src="/Frontend/images/not_found.png" alt="trip_not_found" height="80px" width="80px" />
                        <div class="green-line"></div>
                        <p class="msg-notrip-card">No trip found.</p>
                    </div>
                </div>`;
            throw new Error('Request failed!');
        } 
        return data.json();
    })
    .then(data => {
        console.log('voyage: ', data)
        data.tickets.forEach(ticket => {
            createTicket(ticket);
        });
    })
    .catch(error => {
        console.error('Error fetching tickets:', error);
    });
}

document.querySelector('.btn-search').addEventListener('click', async () => fetchTickets()); 


