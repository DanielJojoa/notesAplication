const mongoose =  require('mongoose');

mongoose.connect('mongodb://localhost/notes',{
    useCreateIndex:true,
    useNewUrlParser: true,
    useFindAndModify:true
}).then(db=>console.log('db is connected'))
  .catch(err=> console.error(err));

