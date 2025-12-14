import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import DataTable from '../common/DataTable'
import Breadcrumb from '../common/Breadcrumb'
import InternshipForm from './InternshipForm'

function InternshipTable({ onBreadcrumbChange }) {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [editingInternship, setEditingInternship] = useState(null)
  const [viewingInternship, setViewingInternship] = useState(null)
  const [mode, setMode] = useState('list') // 'list', 'view', 'add', 'edit'
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Internships' },
  ])
  const navigate = useNavigate()
  const pageSize = 10

  useEffect(() => {
    fetchInternships()
  }, [currentPage, searchTerm, statusFilter, cityFilter])

  useEffect(() => {
    if (onBreadcrumbChange) {
      onBreadcrumbChange(breadcrumbItems)
    }
  }, [breadcrumbItems, onBreadcrumbChange])

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        includeInactive: 'true',
      }

      if (searchTerm) {
        params.search = searchTerm
      }
      if (cityFilter) {
        params.city = cityFilter
      }

      const response = await api.get('/internships', { params })
      if (response.data.success) {
        let data = response.data.data || []
        
        // Filter by status if needed
        if (statusFilter) {
          data = data.filter((i) => i.is_active === (statusFilter === 'true'))
        }

        setInternships(data)
        setTotalItems(response.data.pagination?.total || data.length)
      }
    } catch (error) {
      console.error('Error fetching internships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      // Navigate back to list
      setMode('list')
      setViewingInternship(null)
      setEditingInternship(null)
      setBreadcrumbItems([{ label: 'Internships' }])
    } else if (index === 1 && mode === 'view') {
      // If viewing, go back to list
      setMode('list')
      setViewingInternship(null)
      setBreadcrumbItems([{ label: 'Internships' }])
    } else if (index === 1 && (mode === 'add' || mode === 'edit')) {
      // If adding/editing, go back to list
      setMode('list')
      setEditingInternship(null)
      setBreadcrumbItems([{ label: 'Internships' }])
    }
  }

  const handleView = (internship) => {
    setViewingInternship(internship)
    setMode('view')
    setBreadcrumbItems([
      { label: 'Internships', onClick: () => handleBreadcrumbNavigate(0) },
      { label: internship.mentorName || 'Internship Details' },
    ])
  }

  const handleEdit = (internship) => {
    setEditingInternship(internship)
    setMode('edit')
    setBreadcrumbItems([
      { label: 'Internships', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Edit Internship' },
    ])
  }

  const handleDelete = async (internship) => {
    if (!window.confirm(`Are you sure you want to delete "${internship.mentorName}"?`)) {
      return
    }

    try {
      await api.delete(`/internships/${internship._id}`)
      fetchInternships()
    } catch (error) {
      console.error('Error deleting internship:', error)
      alert('Failed to delete internship')
    }
  }

  const handleAdd = () => {
    setEditingInternship(null)
    setMode('add')
    setBreadcrumbItems([
      { label: 'Internships', onClick: () => handleBreadcrumbNavigate(0) },
      { label: 'Add New Internship' },
    ])
  }

  const handleFormSave = () => {
    fetchInternships()
    setMode('list')
    setEditingInternship(null)
    setBreadcrumbItems([{ label: 'Internships' }])
  }

  const handleFormCancel = () => {
    setMode('list')
    setEditingInternship(null)
    setBreadcrumbItems([{ label: 'Internships' }])
  }

  const columns = [
    {
      key: 'mentorName',
      label: 'Mentor Name',
      sortable: true,
    },
    {
      key: 'profession',
      label: 'Profession',
      sortable: true,
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
    },
    {
      key: 'programs',
      label: 'Programs',
      sortable: false,
      render: (value) => (
        <div className="text-sm text-gray-900">
          {value && Array.isArray(value) ? `${value.length} program(s)` : '0 programs'}
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value !== false
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  // If adding or editing
  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <InternshipForm
          internship={editingInternship}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  // If viewing a single internship
  if (mode === 'view' && viewingInternship) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Internship Details</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentor Name</label>
                <p className="text-lg font-semibold text-gray-900">{viewingInternship.mentorName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <p className="text-lg text-gray-900">{viewingInternship.profession}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <p className="text-lg text-gray-900">{viewingInternship.specialization || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <p className="text-lg text-gray-900">{viewingInternship.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    viewingInternship.is_active !== false
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {viewingInternship.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {viewingInternship.programs && viewingInternship.programs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Programs</label>
                <div className="space-y-3">
                  {viewingInternship.programs.map((program, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{program.title}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><i className="fas fa-clock mr-2"></i>{program.duration}</div>
                        <div><i className="fas fa-money-bill-wave mr-2"></i>₨{program.fees || 0}</div>
                        {program.mode && (
                          <div><i className="fas fa-globe mr-2"></i>{program.mode}</div>
                        )}
                      </div>
                      {program.description && (
                        <p className="text-sm text-gray-600 mt-2">{program.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingInternship.includes && viewingInternship.includes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Includes</label>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {viewingInternship.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewingInternship.cityNote && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City Note</label>
                <p className="text-gray-600">{viewingInternship.cityNote}</p>
              </div>
            )}

            {viewingInternship.additionalInfo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
                <p className="text-gray-600">{viewingInternship.additionalInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="animate-fade-in">
      <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Internships</h2>
          <p className="text-gray-600">Comprehensive internship management system</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i>Add New Internship
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by mentor, profession, city..."
                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Filter by city..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={internships}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        loading={loading}
        emptyMessage="No internships found"
      />
    </div>
  )
}

export default InternshipTable

