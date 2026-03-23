export const instituciones = [
  {
    id: 1,
    nombre: "CIDEM - Centro de Información y Desarrollo de la Mujer",
    tipo: "ONG",
    categorias: ["psicologica", "legal", "informacion"],
    descripcion:
      "Brinda orientación legal, psicológica y acompañamiento a mujeres en situación de violencia.",
    alcance: "La Paz",
    confidencial: true,
    gratuito: true,
    contacto: "Consultar directamente",
  },
  {
    id: 2,
    nombre: "SLIM - Servicio Legal Integral Municipal",
    tipo: "Público",
    categorias: ["legal", "psicologica"],
    descripcion:
      "Servicio gratuito municipal que ofrece atención psicológica y legal a personas en situación de violencia.",
    alcance: "Varias ciudades de Bolivia",
    confidencial: true,
    gratuito: true,
    contacto: "Municipio de tu ciudad",
  },
  {
    id: 3,
    nombre: "DNA - Defensoría de la Niñez y Adolescencia",
    tipo: "Público",
    categorias: ["legal", "psicologica"],
    descripcion:
      "Atiende casos de violencia contra niñas, niños y adolescentes. Servicio gratuito.",
    alcance: "Nacional",
    confidencial: true,
    gratuito: true,
    contacto: "Municipio de tu ciudad",
  },
  {
    id: 4,
    nombre: "Línea 800",
    tipo: "Línea de emergencia",
    categorias: ["emergencia", "informacion"],
    descripcion:
      "Línea gratuita de atención en casos de violencia contra la mujer. Disponible 24/7.",
    alcance: "Nacional",
    confidencial: true,
    gratuito: true,
    contacto: "800-10-0200",
  },
  {
    id: 5,
    nombre: "IPAS Bolivia",
    tipo: "ONG",
    categorias: ["salud", "informacion", "psicologica"],
    descripcion:
      "Organización que trabaja por el acceso a la salud reproductiva, incluyendo orientación sobre anticoncepción y derechos reproductivos.",
    alcance: "Bolivia",
    confidencial: true,
    gratuito: true,
    contacto: "Consultar directamente",
  },
  {
    id: 6,
    nombre: "Centro de la Mujer - CIES",
    tipo: "ONG",
    categorias: ["salud", "psicologica", "informacion"],
    descripcion:
      "Brinda servicios de salud sexual y reproductiva, orientación psicológica y acompañamiento.",
    alcance: "La Paz, Cochabamba, Santa Cruz",
    confidencial: true,
    gratuito: false,
    contacto: "Consultar directamente",
  },
  {
    id: 7,
    nombre: "Fiscalía - FELCC",
    tipo: "Público",
    categorias: ["legal", "emergencia"],
    descripcion:
      "Para denuncias de violencia sexual. Si decides denunciar, tienes derecho a acompañamiento y a no ser revictimizada.",
    alcance: "Nacional",
    confidencial: false,
    gratuito: true,
    contacto: "110 (emergencias) / Fiscalía de tu ciudad",
  },
  {
    id: 8,
    nombre: "Clínicas y Centros de Salud Públicos",
    tipo: "Público",
    categorias: ["salud"],
    descripcion:
      "Puedes acceder a atención médica, anticoncepción y en algunos casos a la pastilla de emergencia.",
    alcance: "Nacional",
    confidencial: true,
    gratuito: true,
    contacto: "Centro de salud más cercano",
  },
];

export const categoriasFiltro = [
  { id: "todas", label: "Todas" },
  { id: "psicologica", label: "Apoyo psicológico" },
  { id: "legal", label: "Orientación legal" },
  { id: "salud", label: "Salud" },
  { id: "emergencia", label: "Emergencias" },
  { id: "informacion", label: "Información" },
];
