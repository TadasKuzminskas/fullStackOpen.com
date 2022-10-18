import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({message}) => { 
  if (!message) {
    return null
  } else {
  return <div className='error'>{message}</div>
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [, setErrorMessage] = useState('')
  const [newTitle, setNewTitle] = useState()
  const [newAuthor, setNewAuthor] = useState()
  const [newUrl, setNewUrl] = useState()
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  //for saving the login token --> allows keeping the login on.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {setMessage('')}, 2000)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  
// <---CreateBlog BLOCK---> //


  const addBlog = () => {
    const blogObj = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
      blogService.create(blogObj)
      setMessage(`a new blog ${newTitle} by ${newAuthor} was added`)
      setTimeout(() => {setMessage('')}, 2000)
      setNewTitle()
      setNewAuthor()
      setNewUrl()
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }
  
  const blogForm = () => (
    <div>
    <h3>{user.username} has logged in</h3>
    <button onClick={handleLogOut}>logout</button>
    <div></div>
    <div>
     <form onSubmit={addBlog}>
       <div>
        title:
       <input
        value={newTitle}
        onChange={handleTitleChange}
      />
      </div>
      <div>
        author:
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />
      </div>
      <div>
        url:
      <input
        value={newUrl}
        onChange={handleUrlChange}
      />
      </div>
      <button type="submit">save</button>
    </form>
    </div> 
    </div> 
  )

  return (
    <div>
      {user === null && loginForm()}
      {user !== null && blogForm()}
      <h2>blogs</h2>
      <Notification message={message}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App