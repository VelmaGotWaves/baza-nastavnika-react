import { Link } from "react-router-dom"
import Isolation_Module from '../images/Isolation_Mode.png'
const Missing = () => {
    return (
        <div className="missing-content">
            <div className="missing-image-container">
                <span className="missing-image-span">
                    404
                </span>
                <img src={Isolation_Module} alt="" className="missing-image" />
            </div>
            <span className="missing-span">
                Ups! Stranica nije pronađenda.
            </span>
            <div className="missing-button-container">
            <Link to="/">
                <button className="missing-button">
                    <span className="missing-button-span">
                    Vrati se na početnu stranicu
                    </span>
                </button>
            </Link>
            </div>
            
        </div>
    )
}

export default Missing
