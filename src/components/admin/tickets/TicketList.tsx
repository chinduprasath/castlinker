import React from 'react';
import { Link } from 'react-router-dom';

interface TicketListProps {
  tickets: any[]; // Replace with actual ticket type later
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">All Tickets</h3>
      {tickets.length === 0 ? (
        <p className="text-muted-foreground">No tickets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticket ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/30 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    <Link to={`/admin/tickets/${ticket.id}`} className="text-gold hover:underline">
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{ticket.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{ticket.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{ticket.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{ticket.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketList; 