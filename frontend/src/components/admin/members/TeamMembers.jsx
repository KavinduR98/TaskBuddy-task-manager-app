import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import memberService from '../../../services/memberService';
import { X } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TeamMembers = () => {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [nameFilter, setNameFilter] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const userData = await memberService.getAllUsers();
            setUsers(userData); 
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to load users")
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />
    }

    // Filter users by name
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(nameFilter.toLowerCase())
    );

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
                backgroundColor: '#D1D5DB',
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
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#000000',
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
    
    // DataTable columns configuration
    const columns = [
        {
            name: 'Member Name',
            selector: row => row.fullName,
            sortable: true,
            grow: 2
        },
        {
            name: 'Email',
            selector: row => row.email || 'N/A',
            sortable: true,
            grow: 2
        },
    ];


  return (
    <div className='p-2'>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
        </div>

        {/* Employee DataTable */}
        <div className="w-full flex justify-start">
            <div className="w-full md:w-3/4">
                <div className="flex justify-end">
                    {/* Search Box + Clear Button */}
                    <div className="mb-4 flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                        <button
                            onClick={() => setNameFilter('')}
                            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-r-md transition-colors ${
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

                <div className="bg-white rounded-lg shadow overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    highlightOnHover
                    stripe
                    responsive
                    customStyles={customStyles}
                    noDataComponent={
                    <div className="p-6 text-center text-gray-500">
                        No members found...
                    </div>
                    }
                />
                </div>
            </div>
        </div>
    </div>
  )
}

export default TeamMembers