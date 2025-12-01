import React, { useEffect } from 'react'
import AddCropForm from '../components/AddCrop';

const AddPlot = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);
  return (
    <div>
        <AddCropForm/>
    </div>
  )
}

export default AddPlot;