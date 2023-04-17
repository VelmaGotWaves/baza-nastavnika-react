import React, { useEffect, useStaten } from "react"

export default function DropdownMultiSelectModuo(importVariables) {
    // console.log(importVariables.nizOpcija)

    const flatOptions = importVariables.nizOpcija?.flat(1)

    const finalOptions = [...new Set(flatOptions)]

    return (
        <div className="dropdown-multi-select-moduo">
            
                {
                    finalOptions.map((option) =>
                        <option
                            className="dropdown-multi-select-moduo-result"
                            key={option}
                            value={option}
                            onClick={() => {
                                importVariables.setSelectedItems([...importVariables.selectedItems, option]);
                                importVariables.setModuo(false)
                            }}
                        >
                            {option}
                        </option>
                    )
                }
            
        </div>
    )
}
