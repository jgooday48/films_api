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
  res.status(200).send('Hello Reddy!')
})


app.get('/films', (req,res)=> { //film page
    res.status(200).send(films)
})



app.get('/films/:id', (req, res) => { // film pages sorted by id
    const idx = req.params.id - 1

    const film = films[idx]

    if (!film) {
        res.status(404).send({ error: "film not found" })
    }
    else {
        res.status(200).send(film)
    }
})

app.post('/films', (req,res) => { // allows adding of films
    const film = req.body
    const lastFilm = films[films.length -1]
    const lastId = lastFilm ? lastFilm.id +1 : 1
    film.id = lastId

    if (film.year===undefined){
        res.status(404).send('Year has not been given')
    }

    if (film.name===undefined) {
        res.status(404).send('Title has not been given')
    }
  

    films.push(film)
    res.status(201).send('film added')
    
} )

app.patch('/films/:id', (req,res) => { // update
    const id = parseInt(req.params.id, 10); 

    const existingFilm = films.find((film) => film.id === id);
  
    if (!existingFilm) {

      res.status(404).send({ error: `cannot update missing film` });
    }
  
   else if (req.body.name===undefined) {
      res.status(422).send({ error: 'You need to specify the name of the film' })
    }
   else{
    existingFilm.name = req.body.name; 
  
    res.status(200).json(existingFilm); }
})

app.delete('/films/:id', (req,res) => { //delete
    console.log(req.params)
    const idx = req.params.id - 1
  
    const film = films[idx]
    if (!idx) {
      res.status(404).send('doesnt exist')
    }
  else {
    film.delete
    res.status(204).send('delete route')}
  
  
})

module.exports = app
