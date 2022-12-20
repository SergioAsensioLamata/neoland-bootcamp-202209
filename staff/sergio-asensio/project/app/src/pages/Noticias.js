import log from '../utils/coolog'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.jpg'
import CreateNotice from '../components/CreateNotice'
import UpdateNotice from '../components/UpdateNotice'
import DeleteNotice from '../components/DeleteNotice'
import retrieveNotices from '../logic/retrieveNotices'
import retrieveNotice from '../logic/retrieveNotice'
import retrieveUser from '../logic/retrieveUser'
import { errors } from 'com'
import Context from '../components/Context'
import { useContext } from 'react'
import { MdDeleteForever, MdEdit } from 'react-icons/md'
// import { IoInvertModeOutline } from 'react-icons/io5'




const { FormatError, AuthError, LengthError, NotFoundError } = errors

function Noticias() {
    log.info('Noticias -> render')

    const [createNoticeVisible, setCreateNoticeVisible] = useState(false)
    const [updateNoticeVisible, setUpdateNoticeVisible] = useState(false)
    const [deleteNoticeVisible, setDeleteNoticeVisible] = useState(false)

    const [notice, setNotice] = useState()
    const [user, setUser] = useState()

    const [notices, setNotices] = useState([])
    const { showAlert } = useContext(Context)

    useEffect(() => {
        userRetrieve()
        noticesRetrieve()
        // try {
        //     Promise.all([retrieveUser(sessionStorage.token), retrieveNotices(sessionStorage.token)])
        //         .then(([user, notices]) => {
        //             setUser(user)
        //             setNotices(notices)
        //         })
        //         .catch(error => {
        //             if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
        //                 showAlert(error.message, 'warn')
        //             else if (error instanceof AuthError || error instanceof NotFoundError)
        //                 showAlert(error.message, 'error')
        //             else
        //                 showAlert(error.message, 'fatal')
        //         })
        // } catch (error) {
        //     if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
        //     showAlert(error.message, 'warn')
        // else
        //     showAlert(error.message, 'fatal')
        // }
    }, [])

    const userRetrieve = () => {
        try {
            retrieveUser(sessionStorage.token)
                .then(user => {
                    setUser(user)
                })

                .catch(error => {
                    if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                        showAlert(error.message, 'warn')
                    else if (error instanceof AuthError || error instanceof NotFoundError)
                        showAlert(error.message, 'error')
                    else
                        showAlert(error.message, 'fatal')
                })
        } catch (error) {
            if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                showAlert(error.message, 'warn')
            else
                showAlert(error.message, 'fatal')
        }
    }

    const noticesRetrieve = () => {
        try {
            retrieveNotices(sessionStorage.token)
                .then(notices => setNotices(notices))
                .catch(error => {
                    if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                        showAlert(error.message, 'warn')
                    else if (error instanceof AuthError || error instanceof NotFoundError)
                        showAlert(error.message, 'error')
                    else
                        showAlert(error.message, 'fatal')
                })
        } catch (error) {
            if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                showAlert(error.message, 'warn')
            else
                showAlert(error.message, 'fatal')
        }
    }

    const openCreateNotice = () => {
        setCreateNoticeVisible(true)
    }
    const closeCreateNotice = () => setCreateNoticeVisible(false)
    const handleNoticeCreated = () => noticesRetrieve()

    const openUpdateNotice = (noticeId) => {
        try {
            retrieveNotice(sessionStorage.token, noticeId)
                .then(notice => {
                    setNotice(notice)
                    setUpdateNoticeVisible(true)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }

    const closeUpdateNotice = () => setUpdateNoticeVisible(false)
    const handleNoticeUpdated = () => {
        noticesRetrieve()
        setUpdateNoticeVisible(false)
    }

    const openDeleteNotice = (noticeId) => {
        try {
            retrieveNotice(sessionStorage.token, noticeId)
                .then(notice => {
                    setNotice(notice)
                    setDeleteNoticeVisible(true)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }

    const closeDeleteNotice = () => setDeleteNoticeVisible(false)
    const handleNoticeDeleted = () => {
        noticesRetrieve()
        setDeleteNoticeVisible(false)
    }

    return <><header className='h-1/6 top-0 flex justify-around items-center bg-teal-600	'>
        <Link to="/"><img src={logo} className='w-20 h-20 cursor-pointer' /></Link>
        <h1>NOTICIAS</h1>
        <h2>{user?.name}</h2>
        {user?.role === 'admin' && <button onClick={() => openCreateNotice()}> + </button>}
    </header>
        <div className="flex flex-col items-center gap-2 py-[5rem] h-full  bg-gray-100">
            {notices.map(notice => {
                return <article key={notice.id} className="border rounded-xl w-[50%] flex flex-col p-5 break-words  bg-green-50">
                    <p className='underline p-2'>{notice.title}</p>
                    <p>{notice.body}</p>
                    {user?.role === 'admin' && <div>
                        <button onClick={() => openUpdateNotice(notice.id)}><MdEdit/></button>
                        <button onClick={() => openDeleteNotice(notice.id)}><MdDeleteForever/></button>
                    </div>}
                </article>
            })}

        </div>
        {createNoticeVisible && <CreateNotice onCreated={handleNoticeCreated} onClose={closeCreateNotice} />}
        {updateNoticeVisible && <UpdateNotice notice={notice} onUpdated={handleNoticeUpdated} onClose={closeUpdateNotice} />}
        {deleteNoticeVisible && <DeleteNotice notice={notice} onDeleted={handleNoticeDeleted} onClose={closeDeleteNotice} />}
    </>
}
export default Noticias