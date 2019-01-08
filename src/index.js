const express =  require('express');
const app = express();
const exphbs = require('express-handlebars')
const methodOveride =  require('method-override')
const sessions = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
require('./database')
require('./config/passport')

// settings
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs'
}));
app.set('view engine','.hbs');

// middlewaes
app.use(express.urlencoded({extended: false}));
app.use(methodOveride('_method'));
app.use(sessions({
    secret:'Node Pr0gr4mm1ng',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// global variables
    app.use((req,res, next)=>{
        res.locals.success_msg =  req.flash('success_msg');
        res.locals.error_msg =  req.flash('error_msg');
        res.locals.error =  req.flash('error');
        res.locals.user =  req.user || null;
        next();
    });
// routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));
// static files
app.use(express.static(path.join(__dirname,'public')));
//server is listening
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
    
});
