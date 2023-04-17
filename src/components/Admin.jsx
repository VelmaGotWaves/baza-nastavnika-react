import DisplayAdminSection from "./DisplayAdminSection";
import CreateAdminSection from "./CreateAdminSection";
const Admin = () => {
    return (

        <div className="admin-page-container">
            <div className="admin-container">
                <DisplayAdminSection />
                <hr className='admin-display-seperator' />

                <CreateAdminSection />
            </div>
        </div>

    )
}

export default Admin
