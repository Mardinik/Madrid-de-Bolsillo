var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
const createError = require('http-errors');
const passport = require("./passport/setup");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require('mongoose');
const User = require('./models/Users'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api'); 
var markersRouter = require('./routes/markers');

var app = express();

// CONEXIÓN A MONGO ATLAS (BD EN LA NUBE)
var mongoDB = 'mongodb+srv://mardini:vDZ8tZYR0nmLEFo3@madriddebolsillo.ahd8y8d.mongodb.net/?retryWrites=true&w=majority&appName=MadridDeBolsillo';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Express Session
app.use(
  session({
    secret: "very secret this is",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware para verificar la autenticación del usuario
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      // Si el usuario está autenticado, continuar con la solicitud
      return next();
  }

  res.redirect('/'); 
};

// Agregar el middleware isAuthenticated a las rutas que requieran autenticación
app.use('/admin', isAuthenticated);
app.use('/markers', isAuthenticated);

// Middleware para verificar si el usuario está presente en la base de datos
app.use((req, res, next) => {
  if (req.user) {
    // Si el usuario está autenticado, verificar si existe en la base de datos
    User.findById(req.user._id).exec()
      .then(user => {
        if (!user) {
          // Si el usuario no está presente, limpiar la sesión y redirigir a la página de inicio
          req.logout(); // Limpiar sesión
          return res.redirect('/');
        }
        // Si el usuario existe en la base de datos, continuar con la solicitud
        next();
      })
      .catch(err => {
        // Manejar cualquier error que ocurra durante la consulta
        console.error(err);
        return next(err);
      });
  } else {
    // Si el usuario no está autenticado, continuar con la solicitud
    next();
  }
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter); 
app.use('/markers', markersRouter);

// Acerca de
app.get('/acerca', (req, res) => {
  res.render('acerca', { title: 'Acerca de', user: req.user });
});

// Contacto
app.get('/contacto', (req, res) => {
  res.render('contacto', { title: 'Contacto', user: req.user });
});

// Inicio
app.get('/index', (req, res) => {
  res.render('index', { title: '', user: req.user });
});

// Crear
app.get('/crear', isAuthenticated, (req, res) => {
  res.render('crear', { title: 'Crear Plan', user: req.user });
});


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
