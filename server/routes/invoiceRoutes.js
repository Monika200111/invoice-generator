const express = require('express');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// 👇 PDF controller import
const { downloadInvoicePDF } = require('../controllers/pdfController');

const router = express.Router();


// ============================
// CREATE INVOICE
// ============================
router.post('/', auth, async (req, res) => {
  try {
    const { clientName, items, validUntil } = req.body;

    if (
      !clientName ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !validUntil
    ) {
      return res.status(400).json({
        error: 'Please fill all required fields'
      });
    }

    // Validate items
    for (const item of items) {
      if (!item.name || item.qty <= 0 || item.rate < 0) {
        return res.status(400).json({
          error: 'Invalid item data'
        });
      }
    }

    const total = items.reduce((sum, item) => {
      return sum + Number(item.qty) * Number(item.rate);
    }, 0);

    const gst = 18;
    const gstAmount = Math.round(total * (gst / 100));
    const grandTotal = total + gstAmount;

    const newInvoice = new Invoice({
      user: req.user.id,
      clientName: clientName.trim(),
      items,
      validUntil: new Date(validUntil),
      total,
      gst,
      gstAmount,
      grandTotal
    });

    const savedInvoice = await newInvoice.save();

    res.status(201).json(savedInvoice);
  } catch (err) {
    console.error('Invoice Creation Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});


// ============================
// GET ALL INVOICES (USER)
// ============================
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (err) {
    console.error('Fetch Invoice Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});


// ============================
// DOWNLOAD PDF
// ============================
router.get('/pdf/:id', auth, downloadInvoicePDF);


module.exports = router;