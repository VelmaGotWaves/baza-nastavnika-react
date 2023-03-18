import { useContext } from "react";
import ProfContext from "../context/ProfProvider";

const useProf = () => {
    return useContext(ProfContext);
}

export default useProf;