import React from 'react';
import './SideBarItem.css';

function SideBarItem({ logoSrc, logoType }) {
    return (
        <div className='sidebar-item-box'>
            <div className="sidebar-item">
                <div className="sidebar-icon">
                    {
                        logoType === ""
                        ?
                        <img style={{filter : 'none', height : '70px'}} src={logoSrc} alt={logoType} />
                        :
                        <img src={logoSrc} alt={logoType} />
                    }
                </div>
                {
                    logoType !== ""
                        
                    ?
                        <>
                            <div className="sidebar-name">
                                <span>{logoType}</span>
                            </div>
                        </>
                    :
                        <>
                        </>
                }
            </div>
        </div>
    )
}

export default SideBarItem