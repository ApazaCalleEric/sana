export const testimonios = [
  {
    id: 1,
    titulo: "Mi cuerpo reaccionó",
    categoria: "violencia-sexual",
    categoriaLabel: "Violencia sexual",
    duracion: "2:14",
    audioSrc: "/audios/Testimonio%201.mp3",
    resumen:
      "Tenía 17 años cuando me pasó. Durante meses no pude decirle a nadie, porque sentía que nadie me iba a creer. Esta es la historia de cómo aprendí que lo que viví no fue mi culpa.",
    transcript: `No sé cómo empezar esto… porque es algo que me costó mucho entender.
Siempre pensé que si algo así me pasaba, iba a reaccionar, a defenderme… pero no fue así.
Me quedé paralizada. No pude moverme. No dije nada.
Y lo peor… es que mi cuerpo reaccionó.
Y eso me confundió muchísimo. Porque pensé… "Si mi cuerpo respondió… entonces no fue tan grave" "Tal vez yo lo permití" "Tal vez fue mi culpa"
Durante mucho tiempo me repetí eso.
Me sentía culpable… incluso avergonzada de mi propio cuerpo.
No se lo conté a nadie. Porque me daba miedo que pensaran lo mismo que yo pensaba.
Que yo lo había provocado.
Pero por dentro… había algo que no encajaba. Algo que me decía que eso no estuvo bien.
Todavía estoy tratando de entenderlo. Pero sí sé algo…
Yo no quería.`,
    advertencia: true,
    ejeInfo: "violencia-sexual",
    color: "rose",
    emoji: "🌷",
  },
  {
    id: 2,
    titulo: "Era alguien de mi familia",
    categoria: "violencia-sexual",
    categoriaLabel: "Violencia sexual",
    duracion: "1:58",
    audioSrc: "/audios/Testimonio%202.mp3",
    resumen:
      "No fue un extraño. Era alguien de mi entorno más cercano. Tardé años en poder nombrarlo y entender que lo que me hicieron no estaba bien.",
    transcript: `Nunca pensé que algo así podía pasar dentro de mi propia casa.
Siempre creí que esos lugares eran seguros. Que la familia era donde una estaba protegida.
Pero no fue así.
Era alguien cercano. Alguien en quien confiaban. Alguien que veía seguido.
Al principio no entendía bien lo que pasaba. Solo sabía que me incomodaba. Que no me gustaba.
Pero tampoco sabía cómo decirlo.
Porque… ¿cómo dices algo así de alguien de tu familia?
Tenía miedo de que no me creyeran. O peor… de que pensaran que yo estaba mal.
Entonces me quedé callada.
Durante mucho tiempo intenté actuar normal. Como si nada pasara.
Pero cada vez que lo veía… sentía el cuerpo tenso, incómodo.
Y me preguntaba si estaba exagerando.
Si tal vez yo lo estaba malinterpretando.
Hoy sé que no.
Que ese silencio no era porque no importaba… sino porque era demasiado difícil de decir en voz alta.
A veces todavía me cuesta nombrarlo. Pero sí sé algo…
No estaba bien.`,
    advertencia: true,
    ejeInfo: "violencia-sexual",
    color: "rose",
    emoji: "🌷",
  },
  {
    id: 3,
    titulo: "No sabía a dónde ir",
    categoria: "embarazo-parto",
    categoriaLabel: "Embarazo y parto",
    duracion: "2:20",
    audioSrc: "/audios/Testimonio%203.mp3",
    resumen:
      "Mi embarazo fue deseado, pero nadie me dijo lo que vendría después. Ni el dolor, ni el miedo, ni lo que significa perder el control de tu propio cuerpo en una sala de partos.",
    transcript: `Nunca pensé que algo tan pequeño… como un atraso… me iba a dar tanto miedo.
Al inicio intenté no pensar en eso. Me repetía que seguro era estrés… que ya me iba a bajar.
Pero los días pasaban… y el miedo crecía.
Empecé a hacer cuentas en mi cabeza. A recordar todo. A preguntarme si habíamos hecho algo mal.
Y ahí me di cuenta de algo… no sabía casi nada.
No sabía bien cómo funcionaban los anticonceptivos. No sabía qué opciones tenía. No sabía qué hacer si existía un riesgo.
Lo primero que hice fue buscar en internet.
Pero terminé más confundida.
Había demasiada información… y al mismo tiempo, nada claro.
Algunas cosas me asustaban. Otras no las entendía. Y otras… parecían escritas para alguien que no era yo.
Pensé en ir a un centro de salud… pero me dio miedo.
Miedo de que me juzguen. De que me hagan preguntas incómodas. De que alguien se entere.
También pensé en contarle a alguien… pero no sabía a quién.
Sentía que todos iban a opinar. Que nadie me iba a escuchar sin juzgar.
Entonces me quedé sola con eso.
Con el miedo. Con las dudas. Con la sensación de que tenía que resolver algo muy grande… sin saber por dónde empezar.
Hasta hoy… creo que lo más difícil no fue el atraso en sí…
Fue no saber a dónde ir para entender lo que me estaba pasando.`,
    advertencia: false,
    ejeInfo: "embarazo-parto",
    color: "amber",
    emoji: "🌻",
  },
];

export const categorias = [
  { id: "todos",            label: "Todos los testimonios" },
  { id: "violencia-sexual", label: "Violencia sexual" },
  { id: "aborto",           label: "Decisiones reproductivas" },
  { id: "embarazo-parto",   label: "Embarazo y parto" },
];

export const categoriaConfig = {
  "violencia-sexual": { label: "Violencia sexual",          color: "#f43f5e", colorLight: "#fff1f2", emoji: "🌷" },
  "aborto":           { label: "Decisiones reproductivas",  color: "#a855f7", colorLight: "#faf5ff", emoji: "🌿" },
  "embarazo-parto":   { label: "Embarazo y parto",          color: "#f59e0b", colorLight: "#fffbeb", emoji: "🌻" },
};
