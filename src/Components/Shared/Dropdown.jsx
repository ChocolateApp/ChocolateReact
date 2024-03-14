import { useEffect, useState } from "react";
import { IoCaretDownOutline, IoCaretUpOutline, IoCheckmarkOutline } from 'react-icons/io5';

import { useLangage } from "../../Utils/useLangage";

export function Dropdown({ elements = [], className = "", setValue, defaultValue = "", defaultText = "", title="", dropdownText=null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropValue, setDropValue] = useState(defaultValue);

    const { getLang } = useLangage();

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue, setValue]);

    const capitalize = (str) => {
        return str?.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    }

    const dropdownTitle = (str) => {
        str = capitalize(str);
        if (title) {
            str = `${title}: ${str}`;
        }
        return str;
    }

    return (
        <div className={`dropdown ${className}`}>
            <button className="dropdown-button input" onClick={() => setIsOpen(!isOpen)}>
                {<div className='unused'></div> }{dropValue ? dropdownTitle(dropValue) : dropdownText || getLang("select")}{isOpen ? <IoCaretUpOutline /> : <IoCaretDownOutline />} 
            </button>
            <div className="dropdown-content" style={{ display: isOpen ? "flex" : "none" }}>
                {Array.isArray(elements) && elements.map((element) => (
                    <button key={element.value} onClick={() => {
                        setValue(element.value);
                        setDropValue(element.text);
                        setIsOpen(false);
                    }}>
                        {dropValue === element.text ? <IoCheckmarkOutline /> : <div className='unused'></div> }
                        {capitalize(element.text)}</button>
                ))}
            </div>
        </div>
    )
}

export function DropdownMultiple({ elements = [], className = "", setValue, defaultValue = [], dropdownText=null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropValue, setDropValue] = useState(defaultValue);

    const { getLang } = useLangage();
    
    return (
        <div className={`dropdown ${className}`}>
            <button className="dropdown-button input" onClick={() => setIsOpen(!isOpen)}>
                {<div className='unused'></div> }{dropdownText || getLang("select")}{isOpen ? <IoCaretUpOutline /> : <IoCaretDownOutline />} 
            </button>
            <div className="dropdown-content" style={{ display: isOpen ? "flex" : "none" }}>
                {Array.isArray(elements) && elements.map((element) => (
                    <button key={element.id} onClick={() => {
                        if (dropValue.includes(element.id.toString())) {
                            setValue(dropValue.filter((value) => value !== element.id.toString()));
                            setDropValue(dropValue.filter((value) => value !== element.id.toString()));
                        } else {
                            setValue([...dropValue, element.id.toString()]);
                            setDropValue([...dropValue, element.id.toString()]);
                        }
                    }}>
                        {dropValue.includes(element.id.toString()) ? <IoCheckmarkOutline /> : <div className='unused'></div> }
                        {element.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
