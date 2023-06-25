const express = require('express');
const router = express.Router();

const getAllUsers = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

const getAUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

const createAUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

const updateUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

const deleteUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

router.route('/').get(getAllUsers).post(createAUser)
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser)

module.exports = router