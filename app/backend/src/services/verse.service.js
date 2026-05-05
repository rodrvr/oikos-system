const verses = [
  { texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.", referencia: "Juan 3:16" },
  { texto: "Jehová es mi pastor; nada me faltará.", referencia: "Salmos 23:1" },
  { texto: "Todo lo puedo en Cristo que me fortalece.", referencia: "Filipenses 4:13" },
  { texto: "El Señor te bendiga, y te guarde.", referencia: "Números 6:24" },
  { texto: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", referencia: "Jeremías 33:3" },
  { texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", referencia: "Mateo 6:33" },
  { texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", referencia: "Mateo 11:28" },
];

class VerseService {
  getDaily() {
    const index = Math.floor(Math.random() * verses.length);
    return verses[index];
  }
}

module.exports = new VerseService();
