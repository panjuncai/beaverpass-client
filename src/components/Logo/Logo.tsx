/* eslint-disable react/prop-types */
import logo from './logo_beta.png'

const Logo: React.FC<{height: number, width: number}> = ({height, width}) => {
    return(
        <div>
            <img src={logo} height={height} width={width} alt="Logo" />
        </div>
    )
}

export default Logo;