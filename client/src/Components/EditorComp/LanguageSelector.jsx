import React, { useState } from 'react';
import  {LANGUAGE_VERSIONS}  from '../../constants';
import { Dropdown } from "react-bootstrap";
import '../../../public/CSS/DropDownItem.css';

const ACTIVE_COLOR = "blue.400";

const languages = Object.entries(LANGUAGE_VERSIONS);

function LanguageSelector({language, onSelect}) {

  return (
    <div className='d-flex ml-2 mb-3'>
        <div className='mt-2 px-3'> Language: </div>
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {language}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{backgroundColor:"#1c1f29"}} >
                {languages.map(([lang, version]) => (
                    <Dropdown.Item key={lang} 
                    className="custom-dropdown-item"  
                    onClick={() => onSelect(lang)}>
                        {lang}
                        &nbsp;
                        ({version})
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    </div>
  )
}

export default LanguageSelector