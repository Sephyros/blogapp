if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://admin:SuperPassword2019@mysecretdata-s2iwg.mongodb.net/test?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}