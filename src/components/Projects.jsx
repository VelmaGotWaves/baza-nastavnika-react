import React from 'react';
import CreateProjectsSection from './CreateProjectsSection';
import DisplayProjectsSection from './DisplayProjectsSection';
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
