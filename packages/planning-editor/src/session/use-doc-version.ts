import { useEffect, useState } from "react";
import type { Doc } from "yjs";

/** Changes on every update of the document, so a reader of it recomputes. */
export function useDocVersion(doc: Doc): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const bump = () => setVersion((current) => current + 1);
    doc.on("update", bump);

    return () => doc.off("update", bump);
  }, [doc]);

  return version;
}
