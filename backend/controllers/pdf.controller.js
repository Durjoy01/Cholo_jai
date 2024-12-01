import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import Ticket from '../models/ticket.models.js';

export const generateTicketPDF = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId).populate('user');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Load and populate the HTML template
    let html = fs.readFileSync(path.resolve('./templates/ticketTemplate.html'), 'utf-8');
    html = html.replace('{{ticketId}}', ticket._id)
               .replace('{{trainName}}', ticket.trainName)
               .replace('{{trainNumber}}', ticket.trainNumber)
               .replace('{{from}}', ticket.from)
               .replace('{{to}}', ticket.to)
               .replace('{{journeyDate}}', ticket.date ? new Date(ticket.date).toDateString() : 'Not available')
               .replace('{{purchaseDate}}', ticket.purchaseDate ? new Date(ticket.purchaseDate).toDateString() : 'Not available')
               .replace('{{seatType}}', ticket.seatType)
               .replace('{{selectedSeats}}', ticket.selectedSeats.join(', '))
               .replace('{{totalCost}}', ticket.totalCost ? `${ticket.totalCost} BDT` : 'Not available')
               .replace('{{userName}}', ticket.user?.name || 'Not available')
               .replace('{{userEmail}}', ticket.user?.email || 'Not available');

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });

    // Close Puppeteer
    await browser.close();

    // Send the PDF as a download response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket_${ticket._id}.pdf`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
  }
};
