export const mensajesBienvenida = [
  {
    id: "bienvenida",
    tipo: "bot",
    texto:
      "Hola. Estoy aquí para acompañarte, no para juzgarte. Puedes preguntarme lo que quieras, con tus propias palabras. No guardo datos, no registra tu identidad.",
  },
  {
    id: "aclaracion",
    tipo: "bot",
    texto:
      "No soy profesional de salud ni abogada. Lo que puedo hacer es orientarte, darte información y mostrarte opciones. Tú decides qué hacer con eso.",
  },
];

export const preguntasRapidas = [
  { id: "q1", texto: "No sé si lo que viví es violencia" },
  { id: "q2", texto: "Tengo miedo de estar embarazada" },
  { id: "q3", texto: "No quiero que nadie se entere" },
  { id: "q4", texto: "¿Qué hago si fui a una consulta y no me creyeron?" },
  { id: "q5", texto: "¿Puedo acceder a anticonceptivos sin permiso de mis padres?" },
  { id: "q6", texto: "Siento culpa y no sé por qué" },
];

export const flujos = {
  q1: {
    pregunta: "No sé si lo que viví es violencia",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Esa duda es completamente válida. Muchas personas se hacen esa misma pregunta, y el hecho de hacértela no significa que estés exagerando.",
      },
      {
        tipo: "bot",
        texto:
          "La violencia sexual incluye cualquier acto sexual que no hayas consentido libremente. Eso incluye situaciones donde sentiste presión, miedo, o cuando alguien tomó decisiones sobre tu cuerpo sin preguntarte.",
      },
      {
        tipo: "bot",
        texto:
          "¿Quieres que te explique más sobre qué es el consentimiento? ¿O preferís conocer rutas de apoyo disponibles?",
      },
    ],
    opciones: [
      { id: "q1_consentimiento", texto: "Sí, quiero entender más sobre el consentimiento" },
      { id: "q1_rutas", texto: "Quiero ver rutas de apoyo" },
      { id: "q1_culpa", texto: "Siento que fue mi culpa" },
    ],
  },
  q1_consentimiento: {
    pregunta: "Quiero entender más sobre el consentimiento",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "El consentimiento es un acuerdo libre, informado y entusiasta. Significa que las dos personas quieren lo que está pasando, en ese momento, sin presión de ningún tipo.",
      },
      {
        tipo: "bot",
        texto:
          "No hay consentimiento cuando: hay miedo, presión, o cuando la otra persona tiene poder sobre vos (un adulto, un jefe, alguien con autoridad). Tampoco cuando estabas dormida, intoxicada, o simplemente no dijiste que sí.",
      },
      {
        tipo: "bot",
        texto:
          "Lo que pasó no fue tu culpa. Si quieres, puedo mostrarte información legal o rutas de apoyo en Bolivia.",
      },
    ],
    opciones: [
      { id: "q1_rutas", texto: "Quiero ver rutas de apoyo" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q1_culpa: {
    pregunta: "Siento que fue mi culpa",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Lo que sentís es muy común, y entiendo que duele mucho cargarlo. Pero necesito decirte algo importante: no fue tu culpa.",
      },
      {
        tipo: "bot",
        texto:
          "La culpa que sientes no viene de haber hecho algo malo. Viene del estigma, de mensajes que nos enseñaron desde chicas sobre cómo debemos comportarnos, vestirnos, estar.",
      },
      {
        tipo: "bot",
        texto:
          "La responsabilidad de lo que pasó es de quien lo hizo, no tuya. Mereces apoyo para procesar eso.",
      },
    ],
    opciones: [
      { id: "q1_rutas", texto: "Quiero ver rutas de apoyo" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q1_rutas: {
    pregunta: "Quiero ver rutas de apoyo",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "En Bolivia existen varias instancias de apoyo para situaciones de violencia sexual. Puedo mostrarte las principales.",
      },
      {
        tipo: "bot",
        texto:
          "Recuerda: no estás obligada a denunciar si no te sientes lista. Puedes buscar apoyo psicológico primero, orientación legal, o simplemente información. Tú decides el ritmo.",
      },
    ],
    opciones: [
      { id: "ver_instituciones", texto: "Ver instituciones disponibles" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
    accion: "instituciones",
  },
  q2: {
    pregunta: "Tengo miedo de estar embarazada",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Respiremos juntas. El miedo que sientes es completamente comprensible. Estoy aquí para ayudarte a pensar con más claridad.",
      },
      {
        tipo: "bot",
        texto:
          "¿Cuánto tiempo hace que tuviste la relación sexual? Esto puede ayudar a saber qué opciones tienes disponibles en este momento.",
      },
    ],
    opciones: [
      { id: "q2_menos72", texto: "Hace menos de 72 horas" },
      { id: "q2_mas72", texto: "Hace más de 72 horas" },
      { id: "q2_nosi", texto: "No sé exactamente cuándo" },
    ],
  },
  q2_menos72: {
    pregunta: "Hace menos de 72 horas",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Si no quieres un embarazo, existe la anticoncepción de emergencia (pastilla del día después). Es legal, segura y efectiva si se toma dentro de las 72 horas.",
      },
      {
        tipo: "bot",
        texto:
          "Puedes conseguirla en farmacias sin receta médica. No es abortiva: previene que ocurra el embarazo. No afecta un embarazo que ya existe.",
      },
      {
        tipo: "bot",
        texto:
          "¿Quieres más información sobre cómo funciona o dónde conseguirla?",
      },
    ],
    opciones: [
      { id: "inicio", texto: "Volver al inicio" },
      { id: "ver_instituciones", texto: "Ver dónde buscar apoyo", accion: "instituciones" },
    ],
  },
  q2_mas72: {
    pregunta: "Hace más de 72 horas",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Si han pasado más de 72 horas desde la relación, la anticoncepción de emergencia ya no es efectiva. En este caso, lo primero es hacer una prueba de embarazo.",
      },
      {
        tipo: "bot",
        texto:
          "Las pruebas de embarazo son más confiables a partir del primer día de atraso de la menstruación, o unos 10-14 días después de la relación.",
      },
      {
        tipo: "bot",
        texto:
          "Si la prueba sale positiva y no deseas continuar con el embarazo, existen opciones. Puedo mostrarte rutas de apoyo donde pueden orientarte con información completa y sin juicio.",
      },
    ],
    opciones: [
      { id: "ver_instituciones", texto: "Ver rutas de apoyo" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
    accion: "instituciones",
  },
  q2_nosi: {
    pregunta: "No sé exactamente cuándo",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Está bien, no pasa nada. Lo primero que puedes hacer es una prueba de embarazo, que puedes conseguir en cualquier farmacia.",
      },
      {
        tipo: "bot",
        texto:
          "Si la prueba sale positiva, hay instancias de apoyo donde pueden orientarte con información completa, confidencial y sin juicio.",
      },
    ],
    opciones: [
      { id: "ver_instituciones", texto: "Ver rutas de apoyo" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q3: {
    pregunta: "No quiero que nadie se entere",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Eso es completamente válido. Tu privacidad importa, y tienes derecho a buscar información sin que nadie se entere.",
      },
      {
        tipo: "bot",
        texto:
          "Este espacio es anónimo. No guardamos datos, no registramos tu identidad, no te pedimos crear una cuenta.",
      },
      {
        tipo: "bot",
        texto:
          "Si te preocupa que alguien vea tu historial, puedes usar modo incógnito en tu navegador. Si necesitas apoyo presencial, también hay instituciones que garantizan confidencialidad.",
      },
    ],
    opciones: [
      { id: "q3_navegacion", texto: "¿Cómo uso el modo incógnito?" },
      { id: "ver_instituciones", texto: "Ver opciones confidenciales de apoyo" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q3_navegacion: {
    pregunta: "¿Cómo uso el modo incógnito?",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "En Chrome o Edge: presiona Ctrl + Shift + N (Windows) o Cmd + Shift + N (Mac) para abrir una ventana de incógnito.",
      },
      {
        tipo: "bot",
        texto:
          "En Firefox: presiona Ctrl + Shift + P. En Safari: Archivo → Nueva ventana privada.",
      },
      {
        tipo: "bot",
        texto:
          "En modo incógnito, el historial de navegación no se guarda. Ideal si compartes el dispositivo con alguien.",
      },
    ],
    opciones: [
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q4: {
    pregunta: "¿Qué hago si fui a una consulta y no me creyeron?",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Lo que sentiste es injusto. No deberías haber tenido que justificar tu experiencia ante nadie.",
      },
      {
        tipo: "bot",
        texto:
          "Lamentablemente, aún hay profesionales que no están capacitados para atender estas situaciones con empatía. Eso no significa que tus vivencias no sean reales o válidas.",
      },
      {
        tipo: "bot",
        texto:
          "Tienes derecho a buscar una segunda opinión, a ser atendida en otro servicio, y a exigir trato digno. Existen organizaciones que pueden acompañarte en ese proceso.",
      },
    ],
    opciones: [
      { id: "ver_instituciones", texto: "Ver instituciones de apoyo" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q5: {
    pregunta: "¿Puedo acceder a anticonceptivos sin permiso de mis padres?",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "En Bolivia, tienes derecho a recibir información y orientación en salud sexual y reproductiva independientemente de tu edad.",
      },
      {
        tipo: "bot",
        texto:
          "Los anticonceptivos como pastillas, condones, inyecciones o el DIU pueden ser accesibles a través de servicios de salud públicos o privados. En algunos casos puede haber barreras en la práctica, por eso es útil conocer organizaciones aliadas.",
      },
      {
        tipo: "bot",
        texto:
          "La decisión sobre tu salud reproductiva es tuya. Ninguna persona tiene derecho a negarle a otra información sobre su propio cuerpo.",
      },
    ],
    opciones: [
      { id: "ver_instituciones", texto: "Ver dónde acceder a estos servicios" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  q6: {
    pregunta: "Siento culpa y no sé por qué",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "La culpa que sientes es una respuesta muy común. No significa que hayas hecho algo malo.",
      },
      {
        tipo: "bot",
        texto:
          "Vivimos en una sociedad que nos enseña desde chicas que somos responsables de lo que nos pasa. Que si nos pasa algo malo, algo debimos haber hecho mal. Eso no es cierto, pero deja huellas.",
      },
      {
        tipo: "bot",
        texto:
          "Sentir culpa no es señal de que eres culpable. Es señal de que cargás algo que no deberías cargar sola. Mereces apoyo para procesar eso.",
      },
    ],
    opciones: [
      { id: "ver_instituciones", texto: "Quiero hablar con alguien" },
      { id: "inicio", texto: "Volver al inicio" },
    ],
  },
  ver_instituciones: {
    pregunta: "Ver instituciones de apoyo",
    respuestas: [
      {
        tipo: "bot",
        texto:
          "Te llevo a la sección de instituciones donde puedes ver opciones de apoyo en Bolivia. Recuerda que tienes derecho a elegir a quién acudir y en qué momento.",
      },
    ],
    opciones: [{ id: "inicio", texto: "Volver al inicio" }],
    accion: "instituciones",
  },
  inicio: {
    pregunta: "Volver al inicio",
    respuestas: [
      {
        tipo: "bot",
        texto: "Aquí estoy. ¿Hay algo más en lo que pueda acompañarte?",
      },
    ],
    opciones: [],
  },
};
