if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://Sephyros:MyP%40%24%24w0rd@trymongo-s2iwg.mongodb.net/test'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'} 
}