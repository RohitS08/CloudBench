import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../../util/isLoggedin';
function logout() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useLogin();
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success'){
                setIsLoggedIn(false);
            }else{
                console.error('Failed to logout:', data.message);
            }
            navigate('/');
        })
    },[]);

    return (
        <div>logout</div>
    )
}

export default logout