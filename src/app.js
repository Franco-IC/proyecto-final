const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('../routes/articles');
const loginRouter = require('../routes/login');
const Article = require('../db/models/Article');
const auth = require('../auth_controller/auth');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
// para procesar datos de forms
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// cookies
app.use(cookieParser());

// rutas Home
app.get('/', auth.isAuth, async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: -1
    });
    res.render('articles/index', { articles: articles, user: req.user });
})
app.get('/home', auth.isAuth, async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: -1
    });
    res.render('articles/index', { articles: articles, user: req.user });
})

// About

app.get('/about', (req, res) => {
    res.render('articles/about')
})

// para eliminar el cache y que no se pueda volver con el botón de Back luego del Logout
app.use((req, res, next) => {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    }
    next();
});

app.use('/', loginRouter);
app.use('/articles', articleRouter);

// Conexión a MongoDB 
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error(err))



app.listen(port,
    () => console.log(`Server en puerto ${port}`)
)