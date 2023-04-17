import React, { useState, useEffect, useRef } from 'react'
// import DropdownMultiSelectModuo from './DropdownMultiSelectModuo'
// import variables ima: placeholder, niz za biranje, nisam ni blizu kraja ovoga, uniqueSelectedItems iliti set izabranog, bice samo const bez state, takodje import niz sa samo katedrama
export default function DropdownMultiSelect(importVariables) {
    const [moduo, setModuo] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        importVariables.setUniqueSelectedItems([...new Set(selectedItems)]);
    }, [selectedItems])
    function removeAButton(button) {
        const newSelectedItems = selectedItems.filter(item => item != button);
        const newUniqueSelectedItems = importVariables.uniqueSelectedItems.filter(item => item != button);
        setSelectedItems(newSelectedItems);
        importVariables.setUniqueSelectedItems(newUniqueSelectedItems);

    }
    function buttonX() {
        setSelectedItems([]);
        importVariables.setUniqueSelectedItems([]);
        setModuo(false);
    }

    const flatOptions = importVariables.nizOpcija?.flat(1)

    const finalOptions = [...new Set(flatOptions)]
    return (
        <div tabIndex={0} onBlur={() => setModuo(false)}>
            <div className="dropdown-multi-select notSelectable" onClick={(e) => setModuo(old => !old)}>
                {importVariables.uniqueSelectedItems.length == 0 ?
                    <span className="dropdown-multi-select-span-placeholder">{importVariables.placeholder}</span> : (
                        <div className="dropdown-multi-select-tags-buttons">
                            {importVariables.uniqueSelectedItems.map((itemus, index) => (

                                <button key={index} onClick={(e) => {
                                    e.stopPropagation();
                                    removeAButton(itemus);
                                }} className="dropdown-multi-select-tag-button">

                                    <span className="material-symbols-outlined dropdown-multi-select-tag-button-icon">
                                        close
                                    </span>
                                    <span className="dropdown-multi-select-tag-button-text">{itemus}</span>
                                </button>

                            ))}
                        </div>

                    )

                }
                <div className="dropdown-multi-select-icons-container">
                    <span className="material-symbols-outlined dropdown-multi-select-span-icon" >
                        expand_more
                    </span>
                </div>
            </div>
            {/* {moduo && <DropdownMultiSelectModuo nizOpcija={importVariables.nizOpcija} selectedItems={selectedItems} setSelectedItems={setSelectedItems} setModuo={setModuo}/>} */}
            {moduo && (
                <div className="dropdown-multi-select-moduo">

                    {
                        finalOptions.map((option) =>
                            <option
                                className="dropdown-multi-select-moduo-result"
                                key={option}
                                value={option}
                                onClick={() => {
                                    setSelectedItems([...selectedItems, option]);
                                    setModuo(false)
                                }}
                            >
                                {option}
                            </option>
                        )
                    }

                </div>
            )}
        </div>

    )
}
