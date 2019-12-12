module.exports = function (app){

    app.use('/login', require('./login'));
    app.use('/auth', require('./auth'));

    app.use('/money', require('./money'));
    app.use('/sale', require('./sale'));
    app.use('/customer', require('./customers'));

}