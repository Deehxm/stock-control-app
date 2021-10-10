const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    code: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, enum : ['ELE', 'APP', 'MOB'], required: true},
    supplierValue: {type: Number, required: true},
    qtyStock: {type: Number, integer: true,default: 0},
    qtySold: {type: Number, integer: true,default: 0}
});

const movementSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'product'},
    type: {type: String, enum : ['I', 'O'], required: true},
    date: {type: Date, default: Date.now},
    saleValue: {type: Number, required: true},
    qty: {type: Number, integer: true}
});

const lastSequence = new Schema({
    code: {type: String, required:true},
    seq: {type: Number, integer: true }
});

const Product = mongoose.model('product', productSchema, 'product');
const Movement = mongoose.model('movement', movementSchema, 'movement');
const LastSequence = mongoose.model('lastSequence', lastSequence, 'last_sequence');

const appSchemas = {
    'Product':Product,
    'Movement':Movement,
    'LastSequence':LastSequence
};

module.exports = appSchemas;