const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
    bloodGroup: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true }
}, { timestamps: true });

module.exports = mongoose.model('BloodStock', bloodStockSchema);