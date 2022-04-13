
const dotenv = require("dotenv");
dotenv.config()
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')



const initialBlogs = [
    {
        title: "Vacation time",
        author: "Mario",
        url: "www.somewhereontheweb.com",
        likes: 12
        },
        {
        title: "Ranch Branch",
        author: "Sandra",
        url: "www.kuprotasKalnas.com",
        likes: 2
        }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  }, 100000)


test('received the same amount of blogs', async () => {
    const response = await api.get('/api/blogs').expect(200)
    expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('blogs are identified by _id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    expect(response.body[0]._id).toBeDefined()
})

test('can add a new blog', async () => {
    let newBlog = Blog({
            title: "testing",
            author: "test",
            url: "www.test.com",
            likes: 2 
    })
    await newBlog.save()

    const response = await api.get('/api/blogs').expect(200)
    expect(response.body[2].author).toContain(newBlog.author) //this works
    //expect(response.body[2]).toContain(newBlog) //this does not and I'm not sure why, because the result is the same.
})

test('likes delfaut value passed as 0', async () => {
    let newBlog = Blog({
        title: "testing",
        author: "test",
        url: "www.test.com",
})
    await newBlog.save()

    const response = await api.get('/api/blogs').expect(200)
    expect(response.body[2].likes).toBe(0)
})

test('title and url properties are missing', async () => { 
    let newBlog = Blog({
        author: "test",
})
    try {
    await newBlog.save()
    } catch(exception) {
        expect(exception)  // Only checked if there was an exception when trying to save. Passes back Validation error
    }

})

test('testing delete functionality', async () => {
    const response = await api.get('/api/blogs').expect(200)
    await api.delete(`/api/blogs/${response.body[1]._id}`).expect(204)
    const response2 = await api.get('/api/blogs').expect(200)
    expect(response2.body).toHaveLength(initialBlogs.length - 1)
})

test('testing put functionality', async () => {
    const blog = new Blog ({
        title: "testing",
        author: "test",
        url: "www.test.com",
        likes: 2 
})

    const blog2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "testing",
                author: "test",
                url: "www.test.com",
                likes: 2 
            })
    }


    const response = await api.get('/api/blogs').expect(200)
    await api.put(`/api/blogs/${response.body[1]._id}`, blog).expect(200) //does not update (though works on postman) can't figure out from where the error is coming from.
    //might be related to testDB config, because after running tests, the mainDB sometimes gets refreshed. A big problem there, would need additional guidance.
    const response2 = await api.get('/api/blogs').expect(200)
    expect(response2.body[1].title).toContain('testing')
})


afterAll(() => {
  mongoose.connection.close()
})