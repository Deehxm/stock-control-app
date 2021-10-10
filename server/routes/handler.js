const express = require('express');
const router = express.Router();
const Schemas = require('../models/Schemas.js');
const url = require('url');

router.get('/', (req, res) => {
    res.end('Server running.');
});

router.get('/products', (req, res) => {
    const urlParam = url.parse(req.url,true).query;
    const args = {
        description: {$regex: urlParam.description ? urlParam.description.toString() : ''},
        code: { $regex: urlParam.code ? urlParam.code.toString() : ''},
        type: urlParam.type ? urlParam.type.toString() : { $regex: ''}
    };
    Schemas.Product.find(args).exec((error, prodData) => {
        if (error) throw error;
        if (prodData) {
            res.end(JSON.stringify(prodData));
        } else {
            res.end();
        }
    })
});

router.patch('/editProduct', (req, res) => {
    const prod = req.body;
    try {
        Schemas.Product.findOneAndUpdate(
            { code: prod.code },
            {
                $set: {
                    description: prod.description,
                    type: prod.type,
                    supplierValue: prod.supplierValue
                }
            }).exec((error) => {
                if (error) res.end('Error editing product.');
                res.end();
            }
            );
    } catch (error) {
        console.error(error);
        res.end();
    }
})

router.delete('/deleteProduct/:id', (req, res) => {
    Schemas.Product.findByIdAndRemove(req.params.id).exec((error) => {
        if (error)
            throw error;
        res.end();
    })
})

router.get('/profit', (req, res) => {
    Schemas.Movement.aggregate([
        {
          '$match': {
            'type': 'O'
          }
        }, {
          '$group': {
            '_id': {
              'type': '$type', 
              'product': '$product'
            }, 
            'totalSaleValue': {
              '$avg': {
                '$multiply': [
                  '$saleValue', '$qty'
                ]
              }
            }
          }
        }
      ]).exec((error, movData) => {
            if (error) throw error;
            if (movData) {
                res.end(JSON.stringify(movData));
            } else {
                res.end();
            }
        })
});

router.post('/addProduct', async (req, res) => {
    const prod = req.body;
    const lastSeq = await Schemas.LastSequence.findOne({ code: prod.type }).exec();
    const seq = parseInt(lastSeq.seq) + 1;
    const code = `${prod.type}-${seq}`;

    const newProd = new Schemas.Product({
        code: code,
        description: prod.description,
        type: prod.type,
        supplierValue: prod.supplierValue,
    });

    try {
        await newProd.save(
            async (error, result) => {
                if (error) res.end('Error creating product.');
                await Schemas.LastSequence.updateOne({ _id: lastSeq._id }, { $set: { seq: seq } }).exec();
                res.end();
            }
        );
    } catch (error) {
        console.error(error);
        res.end();
    }

})

router.post('/addMovement', async (req, res) => {
    const mov = req.body;
    const product = await Schemas.Product.findOne({
        code: mov.product
    }).exec();

    try {
        if (mov.type === 'O' && parseInt(mov.qty) > parseInt(product.qtyStock)) {
            throw Error('Insufficient Stock');
        }
    } catch (error) {
        console.error(error)
        res.status(403).send({ error: error });
        res.end();
        return
    }

    const newMov = new Schemas.Movement
        ({
            product: product._id,
            type: mov.type,
            saleValue: mov.saleValue,
            qty: mov.qty
        });

    const qtyStock = mov.type === 'I' ?
        parseInt(product.qtyStock) + parseInt(mov.qty) :
        parseInt(product.qtyStock) - parseInt(mov.qty);

    const qtySold = mov.type === 'O' ?
        parseInt(product.qtySold) + parseInt(mov.qty) :
        parseInt(product.qtySold);

    try {
        await newMov.save(
            (error) => {
                if (error) res.end('Error creating movement.');
                Schemas.Product.updateOne(
                    { _id: product._id },
                    {
                        $set: {
                            qtyStock: qtyStock,
                            qtySold: qtySold
                        }
                    }).exec((error) => {
                        if (error) res.end('Error editing product.');
                        res.end();
                    }
                    );
                res.end();
            }
        )
    } catch (error) {
        console.error(err);
        res.end();
    }
})

module.exports = router;