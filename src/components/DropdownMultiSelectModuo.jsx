import React, { useEffect, useState } from "react"

export default function DropdownMultiSelectModuo(importVariables) {
    // console.log(importVariables.nizOpcija)

    const flatOptions = importVariables.nizOpcija?.flat(1)

    const finalOptions = [...new Set(flatOptions)]

    return (
        <div className="dropdown-moduo">
            <ul>
                {
                    finalOptions.map((option) =>
                        <li
                            className="liItem"
                            key={option}
                            onClick={() => importVariables.setSelectedItems([...importVariables.selectedItems, option])}
                        >
                            {option}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}
