import React, { useState } from 'react';
import TicketSummaryCards from '@/components/admin/tickets/TicketSummaryCards';
import TicketList from '@/components/admin/tickets/TicketList';
import { Button } from '@/components/ui/button';
import CreateTicketModal from '@/components/admin/tickets/CreateTicketModal';

const AdminTicketManagement = () => {
  // In a real app, you would fetch ticket data here
  // const tickets = []; // Placeholder for ticket data

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dummyTickets = [
    {
      id: 'TICKET-001',
      subject: 'Cannot log in to my account',
      userName: 'Alice Smith',
      assignedTo: 'Admin User 1',
      status: 'Open',
      priority: 'High',
      createdAt: '2023-10-26T10:00:00Z',
    },
    {
      id: 'TICKET-002',
      subject: 'Issue with posting a job',
      userName: 'Bob Johnson',
      assignedTo: 'Unassigned',
      status: 'In Progress',
      priority: 'Medium',
      createdAt: '2023-10-25T14:30:00Z',
    },
    {
      id: 'TICKET-003',
      subject: 'Question about billing',
      userName: 'Charlie Brown',
      assignedTo: 'Admin User 2',
      status: 'Resolved',
      priority: 'Low',
      createdAt: '2023-10-24T09:15:00Z',
    },
    {
      id: 'TICKET-004',
      subject: 'Feature request: Dark mode',
      userName: 'Diana Prince',
      assignedTo: 'Admin User 1',
      status: 'Closed',
      priority: 'Low',
      createdAt: '2023-10-23T11:00:00Z',
    },
  ];

  const handleCreateTicketClick = () => {
    console.log('Create Ticket button clicked');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (ticketData: any) => {
    console.log('Ticket data submitted from modal:', ticketData);
    // In a real app, you would send this data to your backend
    // and then refresh the ticket list.
    handleCloseModal(); // Close modal after submission
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ticket Management</h1>
        <Button onClick={handleCreateTicketClick}>Create Ticket</Button>
      </div>
      <p className="text-muted-foreground">Manage support and issue tickets submitted by users.</p>
      
      {/* Summary Cards */}
      <TicketSummaryCards tickets={dummyTickets} />
      
      {/* Ticket List */}
      <TicketList tickets={dummyTickets} />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AdminTicketManagement; 