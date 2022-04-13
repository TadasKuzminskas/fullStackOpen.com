const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', (request, response) => {
    Blog
      .find({}).populate('user', { username: 1, name: 1})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response, next) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  User.findById(decodedToken.id).then(userResponse => { // OR decodedToken.user ???
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: userResponse,
      likes: body.likes
    })
    blog
      .save()
      .then(result => {
        userResponse.blogs = userResponse.blogs.concat(result._id)
        userResponse.save().then(() =>{
          response.status(201).json(result)
        })
      }).catch(
        error => next(error)
      )
    })
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const { title, author, url, likes} = request.body

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  Blog.findByIdAndUpdate(request.params.id,
    { title, author, url, likes},
    { new: true, runValidators: true, context: 'query' })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error)
    )
})

blogsRouter.delete('/:id', (request, response, next) => {

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  User.findById(decodedToken.id)
  .then(userResponse => {
    Blog.findById(request.params.id)
    .then(blogResponse => {
      try{
      if (blogResponse.user.toString() === userResponse._id.toString()) {
        return blogResponse
      } else {
        console.log('blog not found')
        response.status(204).json({response: 'Blog not found'}).end()
      }
    } catch (error) {
      response.status(204).json({response: 'Blog not found'}).end()
    }
    }) 
    .then(blog => {
      Blog.findByIdAndRemove(blog)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error)) 
    })
  })
})


module.exports = blogsRouter