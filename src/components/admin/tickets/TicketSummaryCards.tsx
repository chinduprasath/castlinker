import React from 'react';

interface TicketSummaryCardsProps {
  tickets: any[]; // Replace with actual ticket type later
}

const TicketSummaryCards: React.FC<TicketSummaryCardsProps> = ({ tickets }) => {
  // Placeholder logic to calculate stats
  const totalTickets = tickets.length;
  const ticketsResolved = tickets.filter(ticket => ticket.status === 'Resolved').length;
  const ticketsPending = tickets.filter(ticket => ticket.status === 'Pending').length;
  const ticketsOpen = tickets.filter(ticket => ticket.status === 'Open').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Total Tickets</h3>
        <p className="text-2xl">{totalTickets}</p>
      </div>
      <div className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Resolved</h3>
        <p className="text-2xl">{ticketsResolved}</p>
      </div>
      <div className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Pending</h3>
        <p className="text-2xl">{ticketsPending}</p>
      </div>
      <div className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Open</h3>
        <p className="text-2xl">{ticketsOpen}</p>
      </div>
    </div>
  );
};

export default TicketSummaryCards; 