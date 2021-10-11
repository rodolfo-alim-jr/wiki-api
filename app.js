const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

const connection = mongoose.connect('mongodb://localhost:27017/wikiDB')

if(connection){
    console.log('successfully connected to the database')
}

// Create a schema
const articlesSchema = mongoose.Schema({
    name: String,
    content: String
})

// Create a model
const Article = mongoose.model("Article", articlesSchema)


// Show articles
// app.get('/articles', (req, res) => {
//     Article.find((err, results) => {
//         if (!err) {
//             res.send(results)
//         } else {
//             res.send(err)
//         }
//     })
// })

// // Post new article
// app.post('/articles', (req, res) => {
//     console.log(req.body.name)

//     const newArticle = new Article({
//         name: req.body.name,
//         content: req.body.content
//     })
    
//     newArticle.save((err) => {
//         if (err) {
//             console.log('Error saving the new article')
//         }
//     })
// })

// // Delete articles
// app.delete('/articles', (req, res) => {
//     Article.deleteMany((err) => {
//         if (err) {
//             console.log('Error deleting the articles')
//         } else {
//             res.send('Successfully deleted the articles')
//         }
//     })
// })

// Chainable route handler
// Get all articles
app.route('/articles')
    .get((req, res) => {
        Article.find((err, results) => {
            if (!err) {
                res.send(results)
            } else {
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            name: req.body.name,
            content: req.body.content
        })
        
        newArticle.save((err) => {
            if (err) {
                console.log('Error saving the new article')
            }
        })
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err) {
                console.log('Error deleting the articles')
            } else {
                res.send('Successfully deleted the articles')
            }
        })
    })

// Get specific article................
app.route('/articles/:id')
    .get((req, res) => {
        const selectedArticle = req.params.id
        Article.findOne({_id: selectedArticle}, (err, results) => {
            if (results) {
                res.send(results)
            } else {
                res.send('no data found')
            }
        })
    })
    .put((req, res) => {
        const selectedArticle = req.params.id
        Article.updateOne({_id: selectedArticle},{name: req.body.name, content: req.body.content},(err) => {
            if (!err) {
                res.send('Successfully updated article')
            } else {
                console.log('Error updating the article')
            }
        })
    })
    .patch((req, res) => {
        const selectedArticle = req.params.id
        Article.updateOne({_id: selectedArticle},{$set: req.body},(err) => {
            if (!err) {
                res.send('Successfully patch article')
            } else {
                console.log('Error patching the article')
            }
        })
    })
    .delete((req, res) =>{
        const selectedArticle = req.params.id
        Article.deleteOne({_id: selectedArticle}, (err) => {
            if (!err) {
                res.send('Successfully deleted the article')
            }
        })
    })

app.listen(3000, () => {
    console.log('connected to port 3000')
})