import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <p className="text-zinc-700 mb-4">
        Tickets will be automatically issued to the Bangladesh Railway Portal after 30 minutes of successful
        payment, provided that the ticketing portal is not down for maintenance. Customers are advised to check
        their email for confirmation of their tickets. In case of any issues, please contact the Bangladesh Railway
        Support Team. Furthermore, tickets cannot be accessed if the portal has been blocked by any of the
        authorities. For more information, refer to the "Refund Policy" section of this website or the "Help" section.
      </p>
      <h2 className="text-xl font-semibold mb-2">Ticket Purchase Limitations Per Day:</h2>
      <ul className="list-disc list-inside  mb-4">
        <li>Bangladesh Railway passengers:</li>
        <li>One ticket for a single journey (each) in a single transaction. The transaction can</li>
        <li>Only be done if the ticketing portal is active.</li>
        <li>Genuine tickets must be printed and presented at the station.</li>
      </ul>
      <h2 className="text-xl font-semibold  mb-2">Ticket Purchase Restrictions for Returning Passengers:</h2>
      <p className="mb-4">
        If you are a returning passenger, Bangladesh Railway Portal allows you to book tickets only if you have
        traveled within the last 30 days. Please ensure that your travel history is updated in the system.
      </p>
      <h2 className="text-xl font-semibold  mb-2">Discounted Tickets:</h2>
      <ul className="list-disc list-inside  mb-4">
        <li>Discounted tickets are valid for 60 days from the date of purchase.</li>
        <li>Discounts are applicable only for specific routes and timings.</li>
        <li>Some charges may be non-refundable.</li>
      </ul>
      <h2 className="text-xl font-semibold  mb-2">International Travel:</h2>
      <p className=" mb-4">
        For international travel, Bangladesh Railway requires that passengers book their tickets at least 48 hours
        before departure. If the ticket is not booked within this timeframe, the ticket will not be valid.
      </p>
      <h2 className="text-xl font-semibold mb-2">Cancellation Policy:</h2>
      <p className=" mb-4">
        Cancellation requests must be submitted through the ticketing portal without any delay. If you have
        questions regarding your cancellation, please contact customer support.
      </p>
      <h2 className="text-xl font-semibold mb-2">Possibility for a refund:</h2>
      <p className="mb-4">
        If you cancel your ticket, a refund will be processed within 7 business days. Please note that refunds
        are subject to a processing fee.
      </p>
      <p >
        The management reserves the right to amend these terms at any time without prior notice.
      </p>
    </div>
  );
};

export default TermsAndConditions;