const express = require('express');

const Parks = require('./parks-model');

const authenticate = require('../auth/authenticate-middleware');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
    Parks.find()
        .then(parks => res.status(200).json(parks))
        .catch(err => res.status(500).json({ message: err }))
});

router.get('/:id', authenticate, (req, res) => {
    Parks.findById(req.params.id) 
        .then(park => {
            if (park) res.status(200).json(park)
            else res.status(404).json({ message: 'No such park' })
        })
        .catch(err => res.status(500).json({ message: err }))
});

router.post('/', (req, res) => {
    Parks.addPark(req.body)
        .then(park => res.status(201).json(park))
        .catch(err => res.status(500).json({ message: err }))
});

router.post('/:id/amenities', (req, res) => {
    Parks.findById(req.params.id) 
        .then(park => {
            if (park) {
                Parks.addAmenity(req.body, req.params.id)
                .then(amenity => res.status(201).json(amenity))
            } else {
                res.status(404).json({ message: 'No such park' })
            }
        })
        .catch(err => res.status(500).json({ message: err }))
});

router.put('/:id', (req, res) => {
    Parks.findById(req.params.id)
        .then(park => {
            if (park) {
                Parks.update(req.body, req.params.id)
                .then(updatedPark => res.json(updatedPark))
            } else {
                res.status(404).json({ message: 'No such park' })
            }
        })
        .catch(err => res.status(500).json({ message: err }))
});

router.delete('/:id', (req, res) => {
    Parks.remove(req.params.id) 
        .then(deleted => res.json({ removed: deleted }))
        .catch(err => res.status(500).json({ message: err }))
});

module.exports = router;