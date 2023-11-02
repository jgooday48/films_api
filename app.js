//import modules and neccessary functions
const express = require('express')
const cors = require('cors')
const films = require('./films.json')
const logger = require('./logger')
const app = express()

// MIDDLEWARE

app.use(cors())
app.use(express.json())
app.use(logger)

app.get('/', (req, res) => { //opening page
  res.status(200).send('Please add \'/films\' to the webbrowser at the top to see the list of films')
})


app.get('/films', (req,res)=> { //films page
    res.status(200).send(films)
})



app.get('/films/:id', (req, res) => { // film pages sorted by id
    const idx = req.params.id - 1

    const film = films[idx]

    if (!film) { // raises error if index doesn't exist
        res.status(404).send({ error: "film not found" })
    }
    else { // else goes to page
        res.status(200).send(film)
    }
})

app.post('/films', (req,res) => { // allows adding of films
    const film = req.body
    const lastFilm = films[films.length -1]
    const lastId = lastFilm ? lastFilm.id +1 : 1
    film.id = lastId

    if (film.year===undefined){ // requires year
        res.status(404).send('Year has not been given')
    }

    if (film.name===undefined) { // requires title
        res.status(404).send('Title has not been given')
    }
  

    films.push(film) // adds film to json file
    res.status(201).send('film added')
    
} )

app.patch('/films/:id', (req,res) => { // update
    const id = parseInt(req.params.id, 10); // gets id from string and converts to integer

    const existingFilm = films.find((film) => film.id === id); //finds if index exists
  
    if (!existingFilm) { // throws error if index does not exist
      res.status(404).send({ error: 'cannot update missing film' });
    }
  
   else{
    existingFilm.name = req.body.name; 
    existingFilm.year = req.body.year
  
    res.status(200).send(existingFilm); }
})

app.delete('/films/:id', (req,res) => { //delete
  const id = parseInt(req.params.id, 10); // gets id from string and converts to integer

  const deletedFilmIndex = films.findIndex((film) => film.id === id); //finds if index exists

  if (deletedFilmIndex === -1) { //checks if user selected an index not in the file
    res.status(404).send({ error: `Film with id ${id} not found` });
  }

  films.splice(deletedFilmIndex, 1); // deletes film requested by index

  res.status(204).send('Film Successfully deleted'); 
})

module.exports = app
