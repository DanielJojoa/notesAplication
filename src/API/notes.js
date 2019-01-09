const router = require('express').Router();
const Note = require('../models/Notes');
const verifyToken = require('./auth/VerifyToken');
router.get('/notes/add', verifyToken, (req, res) => {
    res.render('notes/newNote');
});
router.post('/api/notes/new-note', verifyToken, async (req, res) => {
    console.log(req.body)
    const { title, description } = req.body;
    const errors = [];
    if (!title) errors.push({ text: 'write a title' });
    if (!description) errors.push({ text: 'write a description' });
    if (errors.length > 0) {
        errors.push({text: 'Note not added, you forgot some information'});

        res.json({ status:'error',errors, title, description });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.body.user_id;
        try {
            await newNote.save();
            res.json({status:'success',msg:'Note Added succesfully'})
        } catch (error) {
            res.json({ status: 'error', msg: 'error in server adding notes', error });
        }
     

    }
});
router.post('/api/notes', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.body.user_id }).sort({ date: 'desc' });
        res.json({ status: 'success', notes });
    } catch (error) {
        res.json({ status: 'error',msg:'error in server', error });
    }
    
});
router.post('/api/note/', verifyToken, async (req, res) => {
    try {
        const note = await Note.findById(req.body.note_id);
        if(note){
            res.json({status:'success', note });
        }
        else{
            res.json({ status: 'error', msg: 'note not found', error });
        }
    } catch (error) {
        res.json({ status: 'error', msg: 'error in server', error });

    }
    

});
router.post('/api/notes/edit', verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) errors.push({ text: 'write a title' });
    if (!description) errors.push({ text: 'write a description' });
    if (errors.length > 0) {
        errors.push({ text:'Note not edited, you forgot some information'});

        res.json({status:'error',  errors, title, description });
    } else {
        await Note.findByIdAndUpdate(req.body.id, { title, description });
        res.json({status:'success',msg:'Note Edited Succesfully'});

    }
});
router.post('/api/notes/delete', verifyToken, async (req, res) => {
    await Note.findOneAndDelete(req.body.id);    
    res.json({status:'success',msg:'Note deleted Succesfully'})

});
module.exports = router;