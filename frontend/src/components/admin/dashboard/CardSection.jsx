import React from 'react'

const CardSection = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-2 mb-6">
        {title && <h4 className="text-md font-semibold text-gray-800 m-2">{title}</h4>}
        {children}
  </div>
  )
}

export default CardSection