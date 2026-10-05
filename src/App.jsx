import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  const [products, setProducts] = useState([])

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  const [editingId, setEditingId] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Login failed')
        return
      }

      localStorage.setItem('access_token', data.access_token)
      setToken(data.access_token)
      setMessage('')
    } catch (error) {
      setMessage('Cannot connect to the API.')
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (response.ok) {
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const resetForm = () => {
    setProductName('')
    setDescription('')
    setPrice('')
    setQuantity('')
    setEditingId(null)
  }

  const handleSubmitProduct = async (e) => {
    e.preventDefault()

    const productData = {
      product_name: productName,
      description: description,
      price: Number(price),
      quantity: Number(quantity)
    }

    try {
      const url = editingId
        ? `/api/products/${editingId}`
        : '/api/products'

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Something went wrong.')
        return
      }

      if (editingId) {
        alert('Product updated successfully.')
      } else {
        alert('Product added successfully.')
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      alert('Cannot connect to the API.')
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setProductName(product.product_name)
    setDescription(product.description)
    setPrice(product.price)
    setQuantity(product.quantity)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Delete failed.')
        return
      }

      alert('Product deleted successfully.')

      fetchProducts()
    } catch (error) {
      alert('Cannot connect to the API.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')

    setToken(null)
    setProducts([])
    setUsername('')
    setPassword('')
    setMessage('')

    resetForm()
  }

  useEffect(() => {
    if (token) {
      fetchProducts()
    }
  }, [token])

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Product Management System</h1>
          <p>Login to continue</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit">Login</button>
          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Product Management System</h1>
          <p>Manage your products</p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="product-form-card">

        <h2>
          {editingId
            ? 'Edit Product'
            : 'Add Product'}
        </h2>

        <form onSubmit={handleSubmitProduct}>

          <div className="form-grid">

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                required
              />
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="save-btn"
            >
              {editingId
                ? 'Update Product'
                : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      <div className="product-card">

        <h2>Product List</h2>

        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => (

                <tr key={product.id}>

                  <td>
                    {product.id}
                  </td>

                  <td>
                    {product.product_name}
                  </td>

                  <td>
                    {product.description}
                  </td>

                  <td>
                    ₱{product.price}
                  </td>

                  <td>
                    {product.quantity}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}

export default App