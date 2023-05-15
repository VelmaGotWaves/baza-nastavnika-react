import React from 'react';
import CreateProjectsSection from '../sections/CreateProjectsSection';
import DisplayProjectsSection from '../sections/DisplayProjectsSection';
export default function Projects() {
    return (
        <div className="admin-page-container">
            <div className="admin-container">
                <CreateProjectsSection />
                

                <DisplayProjectsSection />
                <hr className='admin-display-seperator' />
            </div>
        </div>
    )
}
