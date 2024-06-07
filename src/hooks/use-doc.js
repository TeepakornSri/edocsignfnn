import { useContext } from "react";
import { DocContext } from "../contexts/DocContext";

export function useDoc() {
  return useContext(DocContext);
}
