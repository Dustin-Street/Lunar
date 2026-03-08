import axios from "axios";
import { API_BASE_URL } from "../../utils/api";



export default async function handleCreateJournal({ user, title, setShowError, setFlashMessage, setLoading, setJournals, journals, setTitle }) {

    
    //user.id from auth context
    if (!user?.id) {
        setFlashMessage('One moment please, we are verifying your account', 'error');
        return;
    }

    if (title.trim() === '') {
        setShowError(true);
        setFlashMessage('Journal title cannot be empty', 'error');


        return;
    }
    try {
        setLoading(true);
        const response = await axios.post(`${API_BASE_URL}/journals/createJournal`, { title, userID: user.id }, {
            withCredentials: true,
        })
        setLoading(false);
        response.data && setFlashMessage('Journal created successfully');
        setJournals([...journals, response.data]);
        setTitle('');


    } catch (error) {
        console.error('Error creating journal:', error);
        setFlashMessage('Error creating journal');
    }
};