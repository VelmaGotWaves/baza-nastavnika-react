import DisplayAdminSection from "./DisplayAdminSection";
import CreateAdminSection from "./CreateAdminSection";
const Admin = () => {
    return (
        <div className="adminPageContainer">
            <div className="adminPage">
                <DisplayAdminSection />
                <CreateAdminSection />
            </div>
        </div>

    )
}

export default Admin
