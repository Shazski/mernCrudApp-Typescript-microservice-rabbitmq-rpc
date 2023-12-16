import { ReactNode } from 'react'

const Modal = ({ isVisible, onCLose,children }: { isVisible: boolean, onCLose: () => void,children:ReactNode }) => {
  if (!isVisible) return null

  return (
    <div id='wrapper' className='fixed rounded-md inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-[600px] bg-white rounded-md p-2'>
        <button onClick={() => onCLose()} className='text-black text-xl font-bold ms-auto'>X</button>
        <div className='bg-white p-2 text-black' >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
