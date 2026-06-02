const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    clientName: {
      type: String,
      required: true,
      trim: true
    },

    items: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        },
        rate: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    validUntil: {
      type: Date,
      required: true
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    gst: {
      type: Number,
      required: true,
      min: 0
    },

    gstAmount: {
      type: Number,
      required: true,
      min: 0
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);