import React from 'react';
import './SideBarItem.css';

function SideBarItem({ logoSrc, logoType }) {
    return (
        <div className='sidebar-item-box'>
            <div className="sidebar-item">
                <div className="sidebar-icon">
                    <img src={logoSrc} alt={logoType} />
                </div>
                <div className="sidebar-name">
                    <span>{logoType}</span>
                </div>
                
            </div>
        </div>
    )
}

export default SideBarItem