import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };
  return (
    <div className='flex items-center justify-center p-4'>
        <Loader2 className={`${sizeClasses[size]} animate-spin mr-2`}/>
        <span className='text-gray-600'>{text}</span>
    </div>
  )
}

export default LoadingSpinner