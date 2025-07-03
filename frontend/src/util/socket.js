import { io } from 'socket.io-client';
import { useLogin } from './isLoggedin'

const { isLoggedin } = useLogin();

let sockets = {};

export const getSocket = (namespace, accessToken) => {
    if (!sockets[namespace]) {
        // "undefined" means the URL will be computed from the `window.location` object
        const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';

        sockets[namespace] = io(`${URL}/${namespace}`, {
            auth: {
                token: accessToken
            }
        })
    }

    sockets[namespace].on('connect', () => console.log(`Socket Connected to NameSpace: ${namespace}`));
    sockets[namespace].on('disconnect', () => console.log(`Socket Disconnected from Namespace: ${namespace}`));

    return sockets[namespace];
}

export const disconnectSocket = () => {
    if(sockets[namespace]){
        sockets[namespace].disconnect();
        delete sockets[namespace];
    }
}
