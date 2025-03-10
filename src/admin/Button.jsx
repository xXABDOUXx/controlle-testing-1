/* eslint-disable react/prop-types */


const Button = ({body, img}) => {
  return (
    <div className="bg-cyan-400 mb-2 cursor-pointer flex p-2 rounded-md">
        <img src={img} alt="icom" className="w-8 mr-2"/>
        {body}
    </div>
  )
}

export default Button