interface ADRFields {
  id: number;
  name: string;
  supersedes?: number;
}

function parseADRName(name: string): ADRFields | null {
  
  // Se define el patrón regex que busca la estructura del nombre de un ADR
  const pattern = /^(\d{4})-(.*)\.md$/;
  const matches = name.match(pattern);
  
  // Si no hay matches, entonces el nombre no cumple con la estructura requerida
  if (!matches) {
    return null;
  }

  const id = Number(matches[1]);
  const nameWithoutSpaces = matches[2].replace(/-/g, ' ');
  const supersedes = matches[3] ? Number(matches[3]) : undefined;

  return { id, name: nameWithoutSpaces, supersedes };
}

export default parseADRName;