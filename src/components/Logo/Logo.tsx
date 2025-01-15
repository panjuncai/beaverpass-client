import logo from './logo.jpg'

const Logo:React.FC<{height:number,width:number}>=({height,width})=>{
    return(
        <div>
            <img src={logo} height={height} width={width} alt="Logo" />
        </div>
    )
}

export default Logo;