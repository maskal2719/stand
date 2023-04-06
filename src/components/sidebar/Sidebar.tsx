import React from "react";
import logo from '../../../../stend/src/Assets/logo.svg'
import style from '../sidebar/Sidebar.module.css'
const Sidebar = () => {
    return (
        <div className={style.sidebar}>
            <div className={style.containerLogo}>
                <img className={style.logo} src={logo} width="200px" alt='logo'/>
            </div>
        </div>
    );
};

export default Sidebar;