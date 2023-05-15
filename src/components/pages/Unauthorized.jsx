import { useNavigate } from "react-router-dom"
import Isolation_Module from '../../images/Isolation_Mode.png'
const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="missing-content">
            <div className="missing-image-container">
                <span className="missing-image-span">
                    401
                </span>
                <img src={Isolation_Module} alt="" className="missing-image" />
            </div>
            <span className="missing-span">
                Ups! Nije vam dozvoljen pristup ovoj stranici.
            </span>
            <div className="missing-button-container">
                <button className="missing-button" onClick={goBack}>
                    <span className="missing-button-span">
                        Vrati se na unazad
                    </span>
                </button>
            </div>

        </div>
    )
}

export default Unauthorized
