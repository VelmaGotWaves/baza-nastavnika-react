import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/refresh', 
        {refreshTokenApp: auth.refreshTokenApp},
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        // nisam error handleovo ( mozda i jesam nisam sig)
        setAuth(prev => {
            //console.log(JSON.stringify(prev));
            //console.log(response.data.accessToken);
            return {
                ...prev,
                user: response.data.user,
                roles: response.data.roles,
                accessToken: response.data.accessToken,
                refreshTokenApp: response.data.refreshTokenApp
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
