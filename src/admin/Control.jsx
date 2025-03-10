/* eslint-disable react/prop-types */

const Control = ({img}) => {
  return (
    <div className={`${img ? "bg-cyan-400" : ""} rounded-md w-14 h-14 flex items-center justify-center cursor-pointer`}>
        {img ? <img src={img} alt="icon" className="w-8" />  : null}
    </div>
  )
}

export default Control