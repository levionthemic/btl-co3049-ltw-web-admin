// import { useLocation, useNavigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { updateRoomAPI } from '~/apis'
// import { Toast } from '~/utils/toast'
// import { API_ROOT } from '~/utils/constants'

// function EditRoom() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const room = location.state?.room

//   const [form, setForm] = useState({
//     name: '',
//     price_per_night: '',
//     max_guests: '',
//     image_url: '',
//     rating: ''
//   })

//   useEffect(() => {
//     if (!room) return navigate('/room')
//     setForm(room)
//   }, [room])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const res = await updateRoomAPI(room.id, form)
//     if (!res.error) {
//       Toast.fire({ icon: 'success', title: 'Room updated successfully!' })
//       navigate('/room')
//     }
//   }

//   return (
//     <div className="container mt-4">
//       <h2>Edit Room</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">Room Name</label>
//           <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Price per night</label>
//           <input name="price_per_night" type="number" value={form.price_per_night} onChange={handleChange} className="form-control" required />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Max Guests</label>
//           <input name="max_guests" type="number" value={form.max_guests} onChange={handleChange} className="form-control" required />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Image URL</label>
//           <input name="image_url" value={form.image_url} onChange={handleChange} className="form-control" />
//           {form.image_url && <img src={API_ROOT + form.image_url} alt="room" style={{ width: 150, marginTop: 10 }} />}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Rating</label>
//           <input name="rating" type="number" value={form.rating} onChange={handleChange} className="form-control" step="0.1" min="0" max="5" />
//         </div>

//         <button className="btn btn-primary" type="submit">Update Room</button>
//         <button className="btn btn-secondary ms-2" type="button" onClick={() => navigate('/room')}>Cancel</button>
//       </form>
//     </div>
//   )
// }

// export default EditRoom
