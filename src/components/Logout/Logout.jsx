import { useContext, useEffect } from "react";
import axios from "../../config/axiosConfig";
import { DataContext } from "../context/dataContext";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

export default function Logout() {
    const { setUser } = useContext(DataContext);
    const urlUserLogout = "sessions/logout"

    useEffect(() => {
        async function axiosData() {
            axios.get(urlUserLogout, { withCredentials: true })
                .then(response => {
                    setUser(null);
                })
                .catch(error => {
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }
        axiosData();
    }, [])


    return (
        <div className="logout-page">
            <h2>Te esperamos pronto!</h2>
            <Link to={"/account"}><button>Volver a loguearse</button></Link>
        </div>
    )
}
