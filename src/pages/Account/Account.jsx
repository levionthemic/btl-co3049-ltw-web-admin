import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from 'simple-datatables'
import { deleteAccountAPI, fetchAllUsersAPI } from '~/apis'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin3Line } from 'react-icons/ri'
import Swal from 'sweetalert2'
import { Toast } from '~/utils/toast'
import 'simple-datatables/dist/style.css'
import '~/assets/scss/pages/simple-datatables.scss'
import { API_ROOT } from '~/utils/constants'


function Account() {
  const tableRef = useRef(null)
  const dataTableRef = useRef(null)
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  useEffect(() => {
    fetchAllUsersAPI().then((res) => setData(res.data.data))
  }, [])

  useEffect(() => {
    if (!tableRef.current || !data) return

    if (dataTableRef.current) {
      dataTableRef?.current?.destroy()
      dataTableRef.current = null
    }

    dataTableRef.current = new DataTable(tableRef.current)

    const dataTable = dataTableRef.current

    const adaptPageDropdown = () => {
      const selector = dataTable.wrapper.querySelector('.dataTable-selector')
      if (!selector) return
      selector.parentNode.parentNode.insertBefore(selector, selector.parentNode)
      selector.classList.add('form-select')
    }

    const adaptPagination = () => {
      const paginations = dataTable.wrapper.querySelectorAll('ul.dataTable-pagination-list')
      for (const pagination of paginations) {
        pagination.classList.add('pagination', 'pagination-primary')
      }

      const paginationLis = dataTable.wrapper.querySelectorAll('ul.dataTable-pagination-list li')
      for (const li of paginationLis) {
        li.classList.add('page-item')
      }

      const paginationLinks = dataTable.wrapper.querySelectorAll('ul.dataTable-pagination-list li a')
      for (const link of paginationLinks) {
        link.classList.add('page-link')
      }
    }

    const refreshPagination = () => {
      adaptPagination()
    }

    dataTable.on('datatable.init', () => {
      adaptPageDropdown()
      refreshPagination()

      dataTable.wrapper.addEventListener('click', function (e) {
        const target = e.target
        if (target.matches('.edit-icon')) {
          const row = target.closest('tr')
          const id = row?.querySelector('td')?.textContent
          navigate(`/account/edit/${id}`, { state: { account: data.find(d => d.id === id) } })
        }

        if (target.matches('.delete-icon')) {
          const row = target.closest('tr')
          const id = row?.querySelector('td')?.textContent

          Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'primary',
            cancelButtonColor: 'secondary',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              deleteAccountAPI(id).then((res) => {
                if (!res.error) {
                  navigate(0)
                  Toast.fire({
                    title: 'Deleted!',
                    text: 'Your FAQ has been deleted.',
                    icon: 'success'
                  })
                }
              })
            }
          })
        }
      })
    })
    dataTable.on('datatable.update', refreshPagination)
    dataTable.on('datatable.sort', refreshPagination)
    dataTable.on('datatable.page', adaptPagination)

    return () => {
      dataTable.destroy()
    }
  }, [data, navigate])

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Accounts</h3>
            <p className="text-subtitle text-muted">Manage Account section</p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Account</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header d-flex align-item-center justify-content-between">
            <h5 className="card-title">
              Account Table
            </h5>
          </div>
          <div className="card-body">
            <table className="table table-striped" id="table1" ref={tableRef}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Avatar</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.email}</td>
                    <td>{d.name}</td>
                    <td>{d.phone}</td>
                    <td>{d.address}</td>
                    <td><img src={API_ROOT + d.avatar} style={{ width: '50px' }}/></td>
                    <td>
                      {d.status === 'active'
                        ? <span className="badge bg-success">Active</span>
                        : <span className="badge bg-danger">Inactive</span>
                      }
                    </td>
                    <td className='text-right'>
                      <div className='d-flex align-items-center justify-content-center gap-2'>
                        <FiEdit className="edit-icon text-warning" style={{ cursor: 'pointer' }} />
                        <RiDeleteBin3Line className="delete-icon text-danger" style={{ cursor: 'pointer' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Account