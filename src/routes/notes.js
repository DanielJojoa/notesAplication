const router = require('express').Router();
const Note = require('../models/Notes');
const { isAuthenticated } = require('../helpers/helpers')
router.get('/notes/add',isAuthenticated,(req,res)=>{
    res.render('notes/newNote');
});
router.post('/notes/new-note',isAuthenticated,async (req,res)=>{
    const {title , description} = req.body;
    const errors = [];
    if(!title)errors.push({text:'write a title'});    
    if(!description) errors.push({text:'write a description'});
    if(errors.length > 0 ){
        req.flash('error_msg','Note not added, you forgot some information');

        res.render('notes/newNote',{errors,title,description});
    }else{
        const newNote = new Note({title,description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg','Note Added succesfully');
        res.redirect('/notes')
        
    }    
});
router.get('/notes', isAuthenticated,async (req, res)=>{
    const notes =  await Note.find({user:req.user.id}).sort({date:'desc'});
    res.render('notes/allNotes', { notes } );
});
router.get('/notes/edit/:id', isAuthenticated,async (req, res)=>{
    const note =  await Note.findById(req.params.id);
    res.render('notes/editNote', { note } );

});
router.put('/notes/edit-note/:id',isAuthenticated,async (req,res)=>{
    const {title , description} = req.body;
    const errors = [];
    if(!title)errors.push({text:'write a title'});    
    if(!description) errors.push({text:'write a description'});
    if(errors.length > 0 ){
        req.flash('error_msg','Note not edited, you forgot some information');

        res.render('notes/newNote',{errors,title,description});
    }else{
        //const newNote = new Note({title,description});
        await Note.findByIdAndUpdate(req.params.id,{title,description});
        req.flash('success_msg','Note Edited Succesfully');
        res.redirect('/notes');
        
    }  
});
router.post('/notes/delete/:id', isAuthenticated,async (req,res)=>{
    await Note.findOneAndDelete(req.params.id);
    req.flash('success_msg','Note deleted Succesfully');
    res.redirect('/notes')
    
});
module.exports = router;