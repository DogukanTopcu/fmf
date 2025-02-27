import React from 'react'

const Navbar = () => {
  return (
    <nav>
        <div className='container mx-auto max-w-4xl'>
            <div className='w-full flex justify-between py-4 px-2'>
                <p className='font-bold text-4xl text-orange-600'>NBS <span className='text-black'>Lab</span></p>
            </div>
        </div>
    </nav>
  )
}

export default Navbar