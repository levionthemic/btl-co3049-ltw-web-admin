import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createRoomAPI, updateRoomAPI } from '~/apis'
import { Toast } from '~/utils/toast'
import { API_ROOT } from '~/utils/constants'
import sanitizeInput from '~/utils/inputSanitizer'

function CreateRoom() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [urlFile, setUrlFile] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_per_night: '',
    max_guests: '',
    image_url: '',
    rating: ''
  })


  const handleChange = (e) => {
    let { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFile(file)
      const url = URL.createObjectURL(file)
      setUrlFile(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let data = null
    if (file) {
      data = new FormData()
      data.append('image_url', file)
      data.append('name', sanitizeInput(form.name) )
      data.append('description', sanitizeInput(form.description))
      data.append('price_per_night', sanitizeInput(form.price_per_night))
      data.append('max_guests',sanitizeInput(form.max_guests))
      data.append('rating', sanitizeInput(form.rating))
    } else {
      data = form
    }
    const res = await createRoomAPI(data)
    if (!res.error) {
      Toast.fire({ icon: 'success', title: 'Room updated successfully!' })
      navigate('/room')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Room Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Price per night</label>
          <input name="price_per_night" type="number" value={form.price_per_night} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Max Guests</label>
          <input name="max_guests" type="number" value={form.max_guests} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="file" name="image_url" onChange={handleFileChange} className="form-control" />
          {urlFile && <img src= {urlFile} alt="room" style={{ width: 150, marginTop: 10 }} required/>}
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input name="rating" type="number" value={form.rating} onChange={handleChange} className="form-control" step="0.1" min="0" max="5" required/>
        </div>

        <button className="btn btn-primary" type="submit">Create Room</button>
        <button className="btn btn-secondary ms-2" type="button" onClick={() => navigate('/room')}>Cancel</button>
      </form>
    </div>
  )
}

export default CreateRoom
