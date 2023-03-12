import React, { useState, useEffect } from 'react'
import DropdownMultiSelectModuo from './DropdownMultiSelectModuo'
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
    return (
        <>
            <div className="classicWhiteSelect">
                <span className="spanTags">
                    {importVariables.uniqueSelectedItems.length == 0 ? <span>{importVariables.placeholder}:</span> :
                        importVariables.uniqueSelectedItems.map((itemus, index) => (
                            <button key={index} onClick={() => removeAButton(itemus)}>
                                {itemus}
                            </button>))
                    }
                </span>
                <div className="oneLineDiv">
                    <span className="material-symbols-outlined icons" onClick={buttonX}>
                        close
                    </span>
                   
                    <span className="material-symbols-outlined icons" onClick={() => setModuo(!moduo)}>
                        expand_more
                    </span>
                </div>
            </div>
            {moduo && <DropdownMultiSelectModuo nizOpcija={importVariables.nizOpcija} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
        </>

    )
}
