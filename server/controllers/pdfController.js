const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');

exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('user');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Client: ${invoice.clientName}`);
    doc.text(`Created By: ${invoice.user.name}`);
    doc.text(`Date: ${invoice.createdAt.toDateString()}`);
    doc.text(`Valid Until: ${invoice.validUntil.toDateString()}`);

    doc.moveDown();

    invoice.items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} | Qty: ${item.qty} | Rate: ₹${item.rate}`
      );
    });

    doc.moveDown();

    doc.text(`Total: ₹${invoice.total}`);
    doc.text(`GST: ₹${invoice.gstAmount}`);
    doc.text(`Grand Total: ₹${invoice.grandTotal}`);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};