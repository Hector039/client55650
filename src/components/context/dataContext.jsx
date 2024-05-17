import { createContext, useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { redirect } from 'react-router-dom';

const MySwal = withReactContent(Swal)
export const DataContext = createContext([]);

const urlProd = "products"
const urlProdSearch = "products/searchproducts"
const urlCart = "carts"
const urlBuyCart = "tickets/createpreference"
const urlUserLogin = "sessions/login"
const urlUserRegister = "sessions/signin"
const urlUserForgot = "sessions/forgot"
const urlUserTicket = "tickets"
const urlContact = "contact"
const urlUserPassRestoration = "sessions/passrestoration"
const urlUserType = "sessions/premium"
const urlCleanUsers = "sessions/cleanusers"
const urlDeleteUser = "sessions/deleteuser"
const urlUpdateUserRole = "sessions/updateuserrole"

export const DataProvider = ({ children }) => {

    const [products, setProducts] = useState([])
    const [productDetail, setProductDetail] = useState(null)
    const [cart, setCart] = useState([])
    const [cartProdWidget, setCartProdWidget] = useState(0)
    const [user, setUser] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [ticket, setTicket] = useState([])
    const [usersFiltered, setUsersFiltered] = useState([])
    const [inactiveUsers, setInactiveUsers] = useState(null);

    const [categoryFilter, setCategoryFilter] = useState("todos")
    const [priceFilter, setPriceFilter] = useState("todos")
    const [limitFilter, setLimitFilter] = useState(3)
    const [page, setPage] = useState(1)

    useEffect(() => {
        function axiosData() {
            axios.get(urlProd,
                {
                    params: {
                        limit: limitFilter,
                        category: categoryFilter,
                        sort: priceFilter,
                        page: page
                    },
                    withCredentials: true
                })
                .then(response => {
                    setProducts(response.data)
                    setUser(response.data.user);
                    setUserAvatar(response.data.user?.avatar);
                })
                .catch(error => console.log(error))
        }
        axiosData();
    }, [categoryFilter, priceFilter, limitFilter, page])

    const avatar = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        await axios.postForm(`sessions/${user.id}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
            .then(response => {
                setUserAvatar(response.data.avatar);
                toast.success(response.data.message)
            })
            .catch(error => {
                if (error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                if (error.response.status === 400) return toast.error(error.response.data.message);
                if (error.response.status === 500) return toast.error(error.response.data.cause);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const uploads = async (data) => {
        const formData = new FormData();
        if (data.idDoc) if ([...data.idDoc].length === 1) formData.append("idDoc", data.idDoc[0]);
        if (data.adressDoc) if ([...data.adressDoc].length === 1) formData.append("adressDoc", data.adressDoc[0]);
        if (data.accountDoc) if ([...data.accountDoc].length === 1) formData.append("accountDoc", data.accountDoc[0]);
        await axios.postForm(`sessions/${user.id}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
            .then(response => toast.success('Se envió la información correctamente.'))
            .catch(error => {
                if (error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                if (error.response.status === 400) return toast.error(error.response.data.message);
                if (error.response.status === 500) return toast.error(error.response.data.cause);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const cartQuantity = (cart) => {
        const cartProdQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartProdWidget(cartProdQuantity)
        return
    }

    const getProduct = (pid) => {
        axios.get(urlProd + "/" + pid)
            .then(response => {
                setProductDetail(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const getUserCart = (cid) => {
        axios.get(urlCart + "/" + cid, { withCredentials: true })
            .then(response => {
                setCart(response.data.products);
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const login = async (e) => {
        await axios.post(urlUserLogin, { email: e.email, password: e.password }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login correcto!",
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    setUser(response.data);
                    setUserAvatar(response.data.avatar)
                    cartQuantity(response.data.cart.products)
                    window.location.replace("https://hector039.github.io/client55650");
                });
            })
            .catch(error => {
                console.log(error);
                if (error.response.statusText === "Unauthorized") {
                    toast.error(error.response.data.error)
                    return
                };
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const newRegister = (e) => {
        if (e.password !== e.repassword) return toast.error('Los passwords no coinciden. Intenta de nuevo');
        axios.post(urlUserRegister, {
            firstName: e.firstname,
            lastName: e.lastname,
            email: e.email,
            password: e.password
        }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    icon: "success",
                    title: response.data,
                    showConfirmButton: true
                })
            })
            .catch(error => {
                if (error.response.statusText && error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const passRestoration = (e) => {
        if (!e.email) return toast.error('Verifica que el e-mail esté correcto.');
        axios.get(urlUserPassRestoration + "/" + e.email, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    icon: "success",
                    title: response.data,
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(error => {
                if (error.response.status === 400) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const forgot = (e) => {
        if (e.password !== e.repassword) return toast.error('Los passwords no coinciden. Intenta de nuevo');
        axios.post(urlUserForgot, { email: e.email, password: e.password }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Contraseña restaurada!.",
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    window.location.replace("https://hector039.github.io/client55650/account");
                });
            })
            .catch(error => {
                if (error.response.data.code === 1) {
                    toast.error(error.response.data.message)
                    setTimeout(() => {
                        window.location.replace("https://hector039.github.io/client55650/passrestoration");
                    }, 2000)
                    return
                };
                if (error.response.data.code === 2) return toast.error(error.response.data.message)
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const loginGoogle = () => {
        window.open("https://server55650-production.up.railway.app/api/sessions/google", "_self")
    }
    const loginGithub = () => {
        window.open("https://server55650-production.up.railway.app/api/sessions/github", "_self")
    }

    function handleemptycart(cid) {
        axios.delete(urlCart + "/" + cid, { withCredentials: true })
            .then(response => {
                toast.success('Se vació el carrito correctamente.');
                setCart(response.data.products)
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function deleteprod(pid) {
        axios.delete(urlCart + "/product/" + pid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó el producto correctamente.');
                setCart(response.data.products)
                cartQuantity(response.data.products)
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function handleAdd(pid, quantity) {
        axios.post(urlCart + "/addproduct/" + pid, { quantity: quantity }, { withCredentials: true })
            .then(response => {
                toast.success('Se agregó el producto al carrito.');
                cartQuantity(response.data.products)
            })
            .catch(error => {
                if (error.response.data.code === 5) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function buyCart(cid) {
        initMercadoPago(import.meta.env.VITE_MP_PUBLIC_TOKEN, { locale: "es-AR" });
        axios.get(urlBuyCart + "/" + cid, { withCredentials: true })
            .then((response) => {
                MySwal.fire({
                    title: "Confirmar compra?",
                    text: "Los items no disponibles no se procesarán y permanecerán en tu carrito.",
                    icon: "warning",
                    html: <Wallet initialization={{ preferenceId: response.data.id }} customization={{ texts: { valueProp: 'smart_option' } }} />,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: "#d33"
                })
            })
            .catch(error => {
                if (error.response.data.code === 4) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const getUserTickets = (userEmail) => {
        axios.get(urlUserTicket + "/" + userEmail, { withCredentials: true })
            .then(response => setTicket(response.data))
            .catch(error => {
                if (error.response.statusText === "Not Found") return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const sendContactMail = (e) => {
        const name = e.name
        const email = e.email
        const tel = e.telephone
        const subject = e.subject
        const message = e.message
        axios.post(urlContact, { name, email, tel, subject, message })
            .then(response => {
                if (response.data.status === "Success") toast.success('Se envió el mensaje correctamente.');
            }).catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const userTypeSelector = (email) => {
        axios.get(urlUserType + "/" + email, { withCredentials: true })
            .then(response => {
                MySwal.fire({
                    title: response.data.message,
                    text: "Vuelve a iniciar sesión para ver los cambios.",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Entendido!"
                }).then(resp => {
                    window.location.replace("https://hector039.github.io/client55650/logout")
                })
            }).catch(error => {
                if (error.response.status === 409) return toast.error(error.response.data.message);
                if (error.response.status === 400) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })

    }

    //Sistema de alta y bajas del Administrador
    const [productsFound, setproductsFound] = useState([]);

    const addProduct = (e) => {
        const formData = new FormData();
        if (e.prodPic) if ([...e.prodPic].length > 0) {
            [...e.prodPic].forEach(pic => formData.append("prodPic", pic))
        };
        formData.append("title", e.title)
        formData.append("description", e.description)
        formData.append("code", e.code)
        formData.append("price", e.price)
        formData.append("stock", e.stock)
        formData.append("category", e.category)
        formData.append("thumbnail", e.thumbnail)
        formData.append("owner", user.id)
        axios.postForm(urlProd, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })
            .then(response => {
                toast.success('Se agregó el producto correctamente.');
            }).catch(error => {
                if (error.response.status === 409) return toast.error(error.response.data.message);
                if (error.response.status === 500) return toast.error(error.response.data.cause);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const deleteProduct = (id) => {
        axios.delete(urlProd + "/" + id, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó el producto correctamente.');
            })
            .catch(error => {
                if (error.response.data.code === 2) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
        setproductsFound([]);
    }

    const updateProduct = (product) => {
        const title = product.title
        const description = product.description
        const code = product.code
        const price = product.price
        const stock = product.stock
        const category = product.category
        const thumbnails = product.thumbnails
        const status = product.status
        const id = product._id
        const owner = user.id
        axios.put(urlProd + "/" + id, { title, description, code, price, stock, category, thumbnails, status, owner }, { withCredentials: true })
            .then(response => {
                toast.success('Se actualizó el producto correctamente.');
            }).catch(error => {
                if (error.response.status === 409) return toast.error(error.response.data.message);
                if (error.response.data.code === 2) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
        setproductsFound([]);
    }

    const searchProduct = (text) => {
        const productName = text.nombreProducto;
        axios.get(urlProdSearch + "/" + productName, { withCredentials: true })
            .then(response => setproductsFound(response.data))
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const cleanUsers = () => {
        MySwal.fire({
            title: "Atención!",
            text: "Se eliminarán los usuarios con 2 días o más sin actividad, estás seguro?.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Entendido!"
        }).then(resp => {
            if (resp.isConfirmed) {
                axios.delete(urlCleanUsers, { withCredentials: true })
                    .then(response => {
                        toast.success(response.data.message);
                        setUsersFiltered(response.data.users);
                        setInactiveUsers(null)
                    }).catch(error => {
                        if (error.response.status === 409) return toast.error(error.response.data.message);
                        if (error.response.status === 400) return toast.error(error.response.data.message);
                        toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    })
            }
        })
    }

    const deleteUser = (id) => {
        MySwal.fire({
            title: "Atención!",
            text: "Se eliminará el usuario seleccionado, estás seguro?.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Entendido!"
        }).then(resp => {
            if (resp.isConfirmed) {
                axios.delete(urlDeleteUser + "/" + id, { withCredentials: true })
                    .then(response => {
                        if (response.data.message) {
                            toast.success(response.data.message);
                            setUsersFiltered(response.data.users);
                            return
                        }
                        toast.success("No se realizaron cambios");
                    }).catch(error => {
                        if (error.response.status === 409) return toast.error(error.response.data.message);
                        if (error.response.status === 400) return toast.error(error.response.data.message);
                        toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    })
            }

        })
    }
    const updateUserRole = (e) => {
        axios.put(urlUpdateUserRole + "/" + e._id, { role: e.role }, { withCredentials: true })
            .then(response => {
                if (response.data.message) {
                    toast.success(response.data.message);
                    setUsersFiltered(response.data.users);
                    return;
                }
                toast.success("No se realizaron cambios");
            }).catch(error => {
                if (error.response.status === 409) return toast.error(error.response.data.message);
                if (error.response.status === 400) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })

    }

    return (
        <DataContext.Provider value={{
            products, cart, handleemptycart,
            deleteprod, login, newRegister, forgot, user, addProduct, deleteProduct, updateProduct, searchProduct, productsFound,
            setCategoryFilter, setPriceFilter, setLimitFilter, loginGoogle, loginGithub,
            handleAdd, getProduct, productDetail, setPage, buyCart, getUserCart, getUserTickets, ticket, cartQuantity, sendContactMail,
            cartProdWidget, passRestoration, userTypeSelector, uploads, avatar, userAvatar, setUserAvatar, setUser, cleanUsers, setUsersFiltered, usersFiltered,
            inactiveUsers, setInactiveUsers, deleteUser, updateUserRole
        }}>
            {children}
        </DataContext.Provider>
    )
}