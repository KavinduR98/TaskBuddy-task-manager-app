import React, { useEffect, useState, useMemo  } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCheck, UserX, UserMinus, Edit, Trash2, X } from 'lucide-react';
import DataTable from 'react-data-table-component';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import employeeService from '../../services/employeeService';
import LoadingSpinner from '../common/LoadingSpinner'
import { STATUS_COLORS } from '../../utils/constants';

const EmployeeDashboard = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            setError(error.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await employeeService.deleteEmployee(id);
                fetchEmployees(); // Refresh the list
            } catch (error) {
                setError(error.message || 'Failed to delete employee');
            }
        }
    };

    // Filtered employee list based on name
    const filteredEmployees = employees.filter((emp) =>
        emp.name?.toLowerCase().includes(nameFilter.toLowerCase())
    );

    const exportToPDF = () => {
        applyPlugin(jsPDF);
        const doc = new jsPDF();

        const tableColumn = ["Name", "Department", "Position", "Phone", "Status"];
        const tableRows = [];

        employees.forEach(emp => {
            tableRows.push([
                emp.name,
                emp.department || 'N/A',
                emp.position || 'N/A',
                emp.phoneNumber || 'N/A',
                emp.status,
            ]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [59, 130, 246] }, // Tailwind's blue-600
        });

        doc.text("Employee Report", 14, 15);
        doc.save("employee_report.pdf");
    };

    const stats = employeeService.getEmployeeStats(employees)

    const cardData = [
        {
            title: 'Active Employees',
            value: stats.ACTIVE,
            icon: UserCheck,
            color: 'bg-green-100 text-green-800',
            iconColor: 'text-green-600'
        },
        {
            title: 'Inactive Employees',
            value: stats.INACTIVE,
            icon: UserMinus,
            color: 'bg-yellow-100 text-yellow-800',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Terminated Employees',
            value: stats.TERMINATED,
            icon: UserX,
            color: 'bg-red-100 text-red-800',
            iconColor: 'text-red-600'
        }
    ];

    // DataTable columns configuration
    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            grow: 2,
            cell: row => <span className="font-semibold">{row.name}</span>,
        },
        {
            name: 'Department',
            selector: row => row.department || 'N/A',
            sortable: true,
        },
        {
            name: 'Position',
            selector: row => row.position || 'N/A',
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phoneNumber || 'N/A',
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[row.status]}`}>
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/dashboard/employees/edit/${row.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow : true,
            button: true,
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
                paddingLeft: '24px',
                paddingRight: '24px',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f9fafb',
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#e5e7eb',
            },
        },
        headCells: {
            style: {
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#6b7280',
            },
        },
        cells: {
            style: {
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '16px',
                paddingBottom: '16px',
            },
        },
        title: {
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1a202c',
            },
        },
    };

    const SubHeaderComponent = useMemo(() => {
        return (
            <div className="w-full flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 px-4 mt-2 mb-2">
                {/* Export Button */}
                <div className="flex justify-end">
                    <button
                        onClick={exportToPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition-colors"
                    >
                        Export as PDF
                    </button>
                </div>
                {/* Search Box + Clear Button */}
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="border border-gray-300  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <button
                        onClick={() => setNameFilter('')}
                        className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                            nameFilter
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!nameFilter}
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </button>
                </div>
            </div>
        );
    }, [nameFilter, employees]);


    if (loading) {
        return <LoadingSpinner size="lg" text="Loading employees..." />;
    }

  return (
    <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-gray-900'>Employee Management</h1>
            <button
                onClick={() => navigate('/dashboard/employees/create')}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center transition-colors'
            >
                Add New Employee
            </button>
        </div>

        {/* Error message */}
        { error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>
                {error}
            </div>
        )}

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {cardData.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className='bg-white rounded-lg shadow p-6'>
                        <div className='flex items-center'>
                            <div className={`p-3 rounded-full ${card.color}`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`}/>
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font font-medium text-gray-600'>{card.title}</p>
                                <p className='text-2xl font-bold text-gray-900'>{card.value}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Employee DataTable */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
            <DataTable
                title="All Employees"
                columns={columns}
                data={filteredEmployees}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                subHeader
                subHeaderComponent={SubHeaderComponent}
                noDataComponent={
                    <div className="p-6 text-center text-gray-500">
                        No employees found...
                    </div>
                }
            />
        </div>
    </div>
  )
}

export default EmployeeDashboard