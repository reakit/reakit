import * as React from "react";
import VariableContext from "./VariableContext";

export function useThemeVariable(variable: string) {
  const variables = React.useContext(VariableContext);
  return variables[variable];
}

export default useThemeVariable;