const Movie = require('../models/Movie');
const request = require('request');

exports.AddLots = async (req, res) => {
  
    var cont = 0;
    var result;
    poster = false;
    var random = Math.floor(Math.random() * (2199999 - 1000000) ) + 1000000; //2100367
        
    await request("http://www.omdbapi.com/?i=tt"+ random +"&apikey=thewdb", function(error, response, body){
        
        if(!error && response.statusCode == 200){
            result = JSON.parse(body);
            console.log(result);
            console.log(result["Poster"])

            if(result!==undefined && result["Poster"] !== 'N/A'){
                const title = result["Title"];
                const date = result["Year"];
                const genre = result["Genre"];
                const description = result["Plot"];
                const img = result["Poster"];
                const movie = new Movie({
                    title: title, 
                    date: date, 
                    genre: genre,
                    description: description,
                    img: img
                });
                movie.save()
                .then(result => {
                    console.log('Filme criado!');
                    res.redirect('/');
                })
                .catch(error => {
                    console.log(error);
                });
            } else {
                res.redirect('/admin/addLots');
            }
        }
    });
}

exports.GetAddMovie = (req, res) => {
    if(req.session.isadmin){
        res.render('addMovie', {
        pageTitle: "Add Filme",
        loggedIn: req.session.isLoggedIn,
        user : req.session.user        
        });
    }else{
        res.redirect('/login');
    }
}

exports.PostAddMovie = (req, res) => {
    const title = req.body.title;
    const date = req.body.date;
    const genre = req.body.genre;
    const description = req.body.description;
    const img = req.body.imageUrl;
    const movie = new Movie({
        title: title, 
        date: date, 
        genre: genre,
        description: description,
        img: img
    });
    movie
    .save()
    .then(result => {
        console.log('Filme criado!');
        res.redirect('/admin/addMovie');
    })
    .catch(error => {
        console.log(error);
    });

}

exports.DeleteMovie = (req, res) => {
    Movie.findByIdAndRemove(req.params.id)
    .then(result => {
        res.redirect('/');
    })
    .catch(error => {
        console.log(error);
    })   
};

