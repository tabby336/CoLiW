var Bookshelf = require('bookshelf').mysqlAuth;

module.exports = function() {
    var bookshelf = {};

    bookshelf.ApiUser = Bookshelf.Model.extend({
        tableName: 'users'
    });

    bookshelf.ApiOauth = Bookshelf.Model.extend({
    	tableName: 'auth_providers'
    });

    bookshelf.ApiHistory = Bookshelf.Model.extend({
    	tableName: 'history'
    });

    return bookshelf;
}
