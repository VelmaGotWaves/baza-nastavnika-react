import { useNavigate, Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import {useEffect} from 'react'
const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    useEffect(() => {
        navigate('/professors');

    }, [])


    const signOut = async () => {
        await logout();
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
        </section>
    )
}

export default Home
