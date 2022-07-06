// const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { request } = require("express");
const express = require("express");

const STATUS_USER_ERROR = 422;
let ID_NEXT = 1;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests
server.post('/posts',(req ,res) =>{
    const {author , title ,contents} = req.body;
    if (! author || ! title || ! contents){
        return res.status(STATUS_USER_ERROR)
        .json({
            error: "No se recibieron los parámetros necesarios para crear el Post"
        })
    }
    const newPost = {
        id : ID_NEXT,
        author,
        title,
        contents
    }
    posts.push(newPost);
    ID_NEXT++;
    res.json(newPost);
})
server.post('/posts/author/:author',(req , res)=>{
    const {title , contents} = req.body;
    const {author} = req.params;
    if (!author|| !title || !contents){
        return res.status(STATUS_USER_ERROR)
        .json({
            error: "No se recibieron los parámetros necesarios para crear el Post"
        })
    }
    const newPost = {
        id : ID_NEXT,
        author,
        title,
        contents
    }
    posts.push(newPost);
    ID_NEXT++;
    res.json(newPost);
})
/* Filtering the posts by the term that is passed in the query. */
server.get('/posts', (req ,res) =>{
    const {term} = req.query;
    if (term){
        const postFiltrados = posts.filter(p => p.title.includes(term) || p.contents.includes(term))
        return res.json(postFiltrados);
    }
    res.json(posts);
})
server.get('/posts/:author', (req,res)=>{
    const {author} = req.params;
    const postFiltrados = posts.filter(p => p.author === author)
    if (postFiltrados.length === 0){
        res.status(STATUS_USER_ERROR)
        .json({
            error: "No existe ningun post del autor indicado"
        })
    };
    res.json(postFiltrados);
});
server.get('/posts/:author/:title', (req,res)=>{
    const {author ,title} = req.params;
    const postFiltrados = posts.filter(p => p.author === author && p.title === title)
    if (postFiltrados.length === 0){
        res.status(STATUS_USER_ERROR)
        .json({
            error: "No existe ningun post con dicho titulo y autor indicado"
        })
    };
    res.json(postFiltrados);
});
server.put('/posts',(req, res)=>{
    const {id ,title,contents } = req.body;
    if (!id || !title || !contents){
        return res.status(STATUS_USER_ERROR)
        .json({
            error: "No se recibieron los parámetros necesarios para modificar el Post"
        })
    }
    const idFiltrado = posts.find(p => p.id === id);
    if (!idFiltrado){
        res.status(STATUS_USER_ERROR)
        .json({
            error: "No existe posts con este ID"
        })
    }
    idFiltrado.title = title;
    idFiltrado.contents = contents;
    res.json(idFiltrado)
});
server.delete('/posts', (req ,res)=>{
    const {id} = req.body;
    if (!id){
        return res.status(STATUS_USER_ERROR)
        .json({
            error: "No se recibieron los parámetros necesarios para modificar el Post"
        })
    }
    const idFiltrado = posts.find(p => p.id === id);
    if (!idFiltrado){
        res.status(STATUS_USER_ERROR)
        .json({
            error: "No existe posts con este ID"
        })
    }
    posts = posts.filter(p => p.id !== id);
    res.json({ success: true })
})
server.delete('/author', (req ,res)=>{
    const {author} = req.body;
    if (!author){
        return res.status(STATUS_USER_ERROR)
        .json({
            error: "No se recibieron los parámetros necesarios para modificar el Post"
        })
    }
    const authorFiltrado = posts.filter(p => p.author === author);
    if (authorFiltrado.length === 0){
        res.status(STATUS_USER_ERROR)
        .json(
            {"error": "No existe el autor indicado"
        })
    }
    posts = posts.filter(p => p.author !== author);
    res.json(authorFiltrado)
})

module.exports = { posts, server };
