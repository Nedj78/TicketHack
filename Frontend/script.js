const ticketsList = [];

function createTicket(ticket) {
    const arrivalCity = ticket.arrival[0].toUpperCase() + ticket.arrival.slice(1);
    const departureCity = ticket.departure[0].toUpperCase() + ticket.departure.slice(1);
    const dateTicket = new Date(ticket.date);

    const hourTicket = String(dateTicket.getHours()) % 12;
    const minuteTicket = String(dateTicket.getMinutes()).padStart(2, '0');
    let formattedDate = `${hourTicket}:${minuteTicket}`;

    if (dateTicket.getHours() > 0 && dateTicket.getHours() < 12 ) {
        formattedDate = `${hourTicket}:${minuteTicket} am`;
    } else {
        formattedDate = `${hourTicket}:${minuteTicket} pm`;
    }

    const tripCard = document.querySelector('#content-right');

     const isTicketListDisplayed = ticketsList.some(ticketsList => {
        return ticketsList.arrival === arrivalCity &&
               ticketsList.departure === departureCity &&
               ticketsList.date === formattedDate &&
               ticketsList.price === ticket.price;
    });

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

function fetchTickets() {
    let errorMessage = document.querySelector('#error-message');

    const departure = document.querySelector('#departure-input').value; 
    const arrival = document.querySelector('#arrival-input').value; 
    const date = document.querySelector('#date-input').value;

    let inputFields = document.querySelectorAll('#departure-input, #arrival-input, #date-input');

    let optionOne = document.querySelector('#option-one');
    const tripCard = document.querySelector('#content-right');
    const searchButton = document.querySelector('.btn-search');

    tripCard.innerHTML = '';

    ticketsList.length = 0;

    searchButton.disabled = true; 

    if (departure === '' || arrival === '' || date === '') {
        errorMessage.textContent = 'All fields are required';
        
        inputFields.forEach(field => {
            field.style.border = '1.5px solid red';
        });

        tripCard.innerHTML = `
        <div id="option-one">
            <div class="default-card">
                <div>
                    <img src="/Frontend/images/train-tram-solid.svg" alt="train_logo" height="80px" width="80px" />
                    <div class="green-line"></div>
                    <p class="msg-default-card">It's time to book your future ticket trip.</p>
                </div>
            </div>
        </div>
        `;

        searchButton.disabled = false;
        return;
    } else {
        tripCard.innerHTML = '';
        errorMessage.textContent = ''; 

        inputFields.forEach(field => {
            field.style.border = 'none';
            if (field === document.querySelector('#departure-input')) {
                field.style.borderBottom = 'solid rgb(195, 194, 194)';
            } 
        });
    }

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
        if (!data.ok) {
            tripCard.innerHTML = '';
            tripCard.innerHTML += `
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
        tripCard.innerHTML = ''; 
        data.tickets.forEach(ticket => {
            createTicket(ticket);
        });
    })
    .catch(error => {
        console.error('Error fetching tickets:', error);
    })
    .finally(() => {
        searchButton.disabled = false; 
    });

    document.querySelectorAll('#departure-input, #arrival-input, #date-input').forEach(input => {
        input.value = '';
    });
}

document.querySelector('.btn-search').addEventListener('click', fetchTickets);