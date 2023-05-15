import DisplayAdminSection from "../sections/DisplayAdminSection";
import CreateAdminSection from "../sections/CreateAdminSection";
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
