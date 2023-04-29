import React, { useState, useEffect, useRef } from 'react'
import { useFilter } from '@react-aria/i18n';

export default function DropdownMultiSearchID(importVariables) {
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
        const oldArray = [...importVariables.importArray];
        const filteredOldArray = oldArray.filter(item => {
            if (query) {
                if (!(contains(item.nazivProjekta.toLowerCase(), query.toLowerCase()) || contains(item.nazivPrograma.toLowerCase(), query.toLowerCase())|| contains(`${item.nazivPrograma.toLowerCase()} ${item.nazivProjekta.toLowerCase()}`, query.toLowerCase()))) {
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
    }, [selectedItems])
    useEffect(() => {
        setSelectedItems([...new Set(importVariables.insertData)])
    },[importVariables.insertData])

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

                                <button type='button' key={index} onClick={(e) => {
                                    e.stopPropagation();
                                    // OVDE NEGDE MORAS DA STAVIS _.id
                                    setIsFocused(false);
                                    removeAButton(itemus);
                                }} className="dropdown-multi-search-tag-button">

                                    <span className="material-symbols-outlined dropdown-multi-search-tag-button-icon">
                                        close
                                    </span>
                                    <span className="dropdown-multi-search-tag-button-text">{itemus.nazivPrograma} {itemus.nazivProjekta}</span>
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
                                value={item._id}
                                key={item._id}
                                onMouseDown={(e) => {
                                    setSelectedItems(sI => [...sI, item]);
                                    setQuery("");
                                    searchComponentContainer.current.blur();
                                    searchComponentResultsContainer.current.blur();
                                    searchComponentInput.current.blur();
                                }}
                                className="dropdown-multi-search-component-result"
                            >
                                {item.nazivPrograma} {item.nazivProjekta}
                            </option>
                        )
                    })}
                </div>
            }

        </div>
    )
}
