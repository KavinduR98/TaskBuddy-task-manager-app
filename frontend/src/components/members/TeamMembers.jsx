import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import memberService from '../../services/memberService';

const TeamMembers = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

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
            setError(error.message || "Failed to load users")
        } finally {
            setLoading(false);
        }
    }

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
    console.log(users);
    

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
    <div>
        {/* Employee DataTable */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
            <DataTable
           
                columns={columns}
                data={users}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                // subHeader
                // subHeaderComponent={SubHeaderComponent}
                noDataComponent={
                    <div className="p-6 text-center text-gray-500">
                        No members found...
                    </div>
                }
            />
        </div>
    </div>
  )
}

export default TeamMembers