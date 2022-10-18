import blogService from '../services/blogs'
const Blog = ({blog}) => {
  
  return (
  <div>
  <div>
    {blog.title} {blog.author}
  </div>
  <button onClick={() => {
    blogService.deleteBlog(blog.id)
    window.location.reload(false); 
  } }>delete</button> 
  </div>  
  )
}

export default Blog