import React from 'react';

const ContactUs = () => {
  return (
    <div className="p-6 bg-background text-foreground bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      
      <div className="container mx-auto p-6 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">For refund of unsuccessful purchases and card charging issues</h3>
        <ul className="list-disc pl-5">
          <li>bKash: <span className="font-medium">16247</span></li>
          <li>Nagad: <span className="font-medium">16167</span></li>
          <li>Rocket / DBBL Nexus: <span className="font-medium">16216</span></li>
          <li>Upay: <span className="font-medium">16268</span></li>
          <li>Visa / Mastercard: <span className="font-medium">N/A</span></li>
        </ul>
      </div>

      <div className="container mx-auto p-6 mt-4 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Reach out to our support team to report identity theft!</h3>
        <p>If any user has registered with someone else's NID using his/her mobile number, the real/actual NID holder can claim the identity by following the mentioned steps below:</p>
        <p className="font-medium">Send an email to <a href="mailto:support@eticket.railway.gov.bd" className="text-primary underline">support@cholojai.railway.gov.bd</a></p>
        <p>Must attach the following documents with the email:</p>
        <ol className="list-decimal pl-5">
          <li>A scanned copy of the ownership document for the SIM (mobile number)</li>
          <li>A scanned copy of the NID card</li>
        </ol>
      </div>

      <div className="container mx-auto p-6 mt-4 flex flex-col justify-between items-center bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">For Technical Support</h3>
        <p className="font-medium">Tech Support Team: <a href="mailto:support@cholojai.railway.gov.bd" className="text-primary underline">support@cholojai.railway.gov.bd</a></p>
        <div className="mt-4">
          <a href="#" className="text-secondary underline">TERMS AND CONDITIONS</a>
          <span className="mx-2">|</span>
          <a href="#" className="text-secondary underline">PRIVACY POLICY</a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;