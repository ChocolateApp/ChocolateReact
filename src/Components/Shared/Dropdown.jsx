import { useEffect } from 'react';
import { useState } from 'react'
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5'

export function Dropdown({ elements = [], className = "", setValue, defaultValue = "", defaultText = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropValue, setDropValue] = useState(defaultText);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue, setValue]);

    return (
        <div className={`dropdown ${className}`}>
            <button className="dropdown-button input" onClick={() => setIsOpen(!isOpen)}>
                {<div className='unused'></div> }{dropValue ? dropValue : "Sélectionner"}{isOpen ? <IoCaretUpOutline /> : <IoCaretDownOutline />} 
            </button>
            <div className="dropdown-content" style={{ display: isOpen ? "flex" : "none" }}>
                {Array.isArray(elements) && elements.map((element) => (
                    <button key={element.value} onClick={() => {
                        setValue(element.value);
                        setDropValue(element.text);
                        setIsOpen(false);
                    }}>{element.text}</button>
                ))}
            </div>
        </div>
    )
}

export function DropdownMultiple({ elements = [], className = "", setValue, defaultValue = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropValue, setDropValue] = useState(defaultValue);

    return (
        <div className={`dropdown ${className}`}>
            <button className="dropdown-button input" onClick={() => setIsOpen(!isOpen)}>
                {<div className='unused'></div> }{dropValue.length > 0 ? dropValue.join(", ") : "Sélectionner"}{isOpen ? <IoCaretUpOutline /> : <IoCaretDownOutline />} 
            </button>
            <div className="dropdown-content" style={{ display: isOpen ? "flex" : "none" }}>
                {Array.isArray(elements) && elements.map((element) => (
                    <button key={element.value} onClick={() => {
                        if (dropValue.includes(element.value)) {
                            setDropValue(dropValue.filter((value) => value !== element.value));
                        } else {
                            setDropValue([...dropValue, element.value]);
                        }
                    }}>{element.text}</button>
                ))}
                <button onClick={() => {
                    setValue(dropValue);
                    setIsOpen(false);
                }}>Valider</button>
            </div>
        </div>
    )
}