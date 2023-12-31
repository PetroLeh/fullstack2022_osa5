import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
        const user = await loginService.login({
            username, password
        })
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        setUser(user)
        setUsername('')
        setPassword('')
    } catch (exception) {
        // error message
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const loginForm = () => (
    <div>
    <h2>Login</h2>
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
    </div>
  )

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const blogListing = () => (
    <div>
    <h2>blogs</h2>
    <p>{ user.username } logged in
    <button onClick={ logout }>logout</button>
    </p>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
    </div>
  )

  return (
    <div>
        { !user && loginForm() }
        { user && blogListing() }
    </div>
  )
}

export default App