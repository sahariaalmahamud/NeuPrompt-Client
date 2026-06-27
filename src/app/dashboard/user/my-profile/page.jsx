import { getSubscription } from "@/lib/api/subscriptions";
import { getUserSession } from "@/lib/core/session";


const UserProfilePage = async () => {

    const user = await getUserSession();

    const subInfo = await getSubscription(user?.id)

    console.log('user transaction info', subInfo);

    return (
        <div>
            this is my profile page

        </div>
    );
};

export default UserProfilePage;