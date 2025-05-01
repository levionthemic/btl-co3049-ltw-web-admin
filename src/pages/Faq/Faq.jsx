import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from 'simple-datatables'
import { fetchAllFaqsAPI } from '~/apis'

function Faq() {
  const tableRef = useRef(null)
  const dataTableRef = useRef(null)
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  useEffect(() => {
    fetchAllFaqsAPI().then((res) => setData(res.data.data))
  }, [])

  useEffect(() => {
    if (!tableRef.current || !data) return

    if (dataTableRef.current) {
      dataTableRef.current.destroy()
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
    })
    dataTable.on('datatable.update', refreshPagination)
    dataTable.on('datatable.sort', refreshPagination)
    dataTable.on('datatable.page', adaptPagination)

    return () => {
      dataTable.destroy()
    }
  }, [data])

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>FAQs</h3>
            <p className="text-subtitle text-muted">Manage FAQ section</p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                <li className="breadcrumb-item active" aria-current="page">FAQs</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header d-flex align-item-center justify-content-between">
            <h5 className="card-title">
              FAQ Table
            </h5>
            <button className='btn btn-primary' onClick={() => navigate('/faq/create')}>Add FAQ</button>
          </div>
          <div className="card-body">
            <table className="table table-striped" id="table1" ref={tableRef}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.question}</td>
                    <td>{d.answer}</td>
                    <td>{d.created_at}</td>
                    <td>
                      {d.status === 'active'
                        ? <span className="badge bg-success">Active</span>
                        : <span className="badge bg-danger">Inactive</span>
                      }
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

export default Faq