import React, { useState, useEffect, useRef } from 'react'
import { useFilter } from '@react-aria/i18n';
// import donosi - - - katedre niz originalan , izabrane katedre u butonima i takodje placeholder
//  - -   - - - - - -  importVariables.importArray - importVariables.setUniqueSelectedItems i importVariables.uniqueSelectedItems i takodje praceholder
export default function DropdownMultiSearch(importVariables) {
    const [query, setQuery] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(importVariables.importArray);

    let { contains } = useFilter({
        sensitivity: 'base'
    });

    const [isFocused, setIsFocused] = useState(false);
    const searchComponentContainer = useRef(null);
    const searchComponentResultsContainer = useRef(null);
    const searchComponentInput = useRef(null);
    // ovaj use effect je za search koji se filtrirati full katedre, koje se ispisuju dole u opcijama, i kada kliknes na nju oda se ode u uniqueSelectedItems
    useEffect(() => {
        const oldArray= [...importVariables.importArray];
        const filteredOldArray = oldArray.filter(item => {
            if (query) {
                if (!contains(item.toLowerCase(), query.toLowerCase())) {
                    return false;
                }
            }
            return true;
        });

        setFilteredOptions(filteredOldArray);
    }, [query, importVariables.importArray]);
// ovaj use effect se postara da nema duplikata dugmica
    useEffect(() => {
        importVariables.setUniqueSelectedItems([...new Set(selectedItems)]);
    }, [selectedItems]);
    useEffect(() => {
        setSelectedItems([...new Set(importVariables.insertData)]);
    },[importVariables.insertData]);

    function removeAButton(button) {
        const newSelectedItems = selectedItems.filter(item => item != button);
        const newUniqueSelectedItems = importVariables.uniqueSelectedItems.filter(item => item != button);
        setSelectedItems(newSelectedItems);
        importVariables.setUniqueSelectedItems(newUniqueSelectedItems);

    }
    // malo mi je ruzno al sta da radim .  . . . . moram da napravim verziju za katedre i verziju za PROJEKTE (gde ce biti ._id)
    // moram da napravim
    return (
        <div className='dropdown-multi-search-component-container'
            tabIndex={0}
            onClick={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={searchComponentContainer}
        >
            <div className="dropdown-multi-search-input-buttons-container">
                <input
                    value={query}
                    type="text"
                    placeholder={importVariables.placeholder}
                    onChange={(e) => setQuery(e.target.value)}
                    className='dropdown-multi-search-component-input'
                    ref={searchComponentInput}
                    autoComplete="off"
                />
                
                {importVariables.uniqueSelectedItems.length != 0 &&
                    (
                        <div className="dropdown-multi-search-tags-buttons-container">
                            {importVariables.uniqueSelectedItems.map((itemus, index) => (

                                <button type='button'key={index} onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFocused(false);
                                    removeAButton(itemus);
                                }} className="dropdown-multi-search-tag-button">

                                    <span className="material-symbols-outlined dropdown-multi-search-tag-button-icon">
                                        close
                                    </span>
                                    <span className="dropdown-multi-search-tag-button-text">{itemus}</span>
                                </button>

                            ))}
                        </div>
                    )
                }

            </div>
            {isFocused &&
                <div className="dropdown-multi-search-component-results-container" ref={searchComponentResultsContainer}>
                    {filteredOptions.map(item => {
                        return (
                            <option
                                value={item}
                                key={item}
                                onMouseDown={(e) => {
                                    setSelectedItems( sI => [...sI, item]);
                                    setQuery("");
                                    searchComponentContainer.current.blur();
                                    searchComponentResultsContainer.current.blur();
                                    searchComponentInput.current.blur();
                                }}
                                className="dropdown-multi-search-component-result"
                            >
                                {item}
                            </option>)
                    })}
                </div>
            }

        </div>
    )
}
