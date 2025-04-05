// Haal het pakket "Express" op, zodat we het kunnen gebruiken in deze code.
// Dit pakket is eerder geïnstalleerd met `npm install` en staat in package.json.
import express from 'express'

// Haal het pakket "Liquid" op, zodat we sjablonen (templates) kunnen gebruiken in onze code.  
// Dit pakket is geïnstalleerd met `npm install` en staat in package.json.
import { Liquid } from 'liquidjs';

import { codeToHtml } from 'shiki';


// Vul hier jouw eigen ID in (zie de instructies in de leertaak)
const personID = 179

// Haal gegevens op van de WHOIS API (van een persoon met een bepaalde ID).  
// Wacht tot de gegevens binnen zijn voordat je verdergaat.
const personResponse = await fetch('https://fdnd.directus.app/items/person/' + personID)

// // Zet de gegevens die we hebben opgehaald om naar een JSON-formaat, zodat we ze kunnen gebruiken.
const personResponseJSON = await personResponse.json()

const personData = personResponseJSON.data 
personData.custom = JSON.parse(personData.custom)

// Kijk of de gegevens kloppen door ze in de terminal te tonen.  
// (Dit verschijnt in de Node.js terminal, niet in de browserconsole)  
// console.log(personResponseJSON)  // Uitgeschakeld, maar je kunt het activeren door de "//" weg te halen.


// Maak een nieuwe Express-app aan.  
// Dit is de "server" waarmee we verzoeken kunnen afhandelen. 
const app = express()

// Zorg ervoor dat de browser bestanden uit de map 'public' kan gebruiken.  
// Dit zijn dingen zoals CSS, JavaScript, afbeeldingen en lettertypes.  
app.use(express.static('public'))

// Liquid is een tool die helpt om dynamische webpagina's te maken (met dingen die veranderen).  
// In plaats van gewone HTML, gebruiken we Liquid om de pagina’s automatisch in te vullen met gegevens.  
const engine = new Liquid();
// Hier zeg je tegen de app dat het Liquid moet gebruiken om die dynamische webpagina's te maken.
app.engine('liquid', engine.express());

// stel de map waar Liquid templates (sjablonen) staan in.  
// Deze bestanden worden niet direct door de browser geladen, maar door de server gebruikt om dynamische pagina's te maken.
app.set('views', './views')

async function getHighlightedCode() {
  const code = 'const a = 1' // Voorbeeldcode
  return await codeToHtml(code, {
    lang: 'css',
    theme: 'vitesse-dark'
  })
}

// **Gebruik de functie in een route**
app.get('/', async function (request, response) {
  const highlightedCode = await getHighlightedCode() // Wacht op de gesyntacteerde HTML
  response.render('index.liquid', { 
    person: personData,
    highlightedCode // Stuur de HTML-string naar je template
  })
})

// Om Views weer te geven, heb je Routes nodig
// Maak een GET route voor de index (meestal doe je dit in de root, als /)
// In je visitekaartje was dit waarschijnlijk index.html
app.get('/', async function (request, response) {
  // Maak de index.liquid-pagina zichtbaar, en stuur de gegevens (person) die we eerder hebben opgehaald mee naar die pagina.  
  // Deze gegevens worden gebruikt om de pagina in te vullen.
   response.render('index.liquid', {person: personData})
})

// Had je meerdere pagina's, zoals 'contact.html'?  
// Maak dan voor elke pagina een nieuwe route aan, zodat de server weet wat te doen als iemand die pagina bezoekt.  
// Bijvoorbeeld, voor de contactpagina:
app.get('/oefenen', async function (request, response) {
  response.render('oefenen.liquid', {person: personData})
})

// Maak een POST route voor de indexpagina; hiermee kun je bijvoorbeeld gegevens van formulieren ontvangen.  
// Nu doen we er nog niks mee, maar je kunt het later gebruiken.
app.post('/', async function (request, response) {
  // Hier kun je bijvoorbeeld data opslaan of aanpassen, of iets anders doen.  
  // We doen nog niks, dus sturen we de bezoeker terug naar de hoofdpagina.
  response.redirect(303, '/')
})

// Stel in op welke poort de server moet luisteren.  
// Lokaal (op je computer) is het meestal poort 8000, maar als je het ergens online zet, is het vaak poort 80.
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
 // Laat een bericht zien in de console om te zeggen dat de server draait en op welke poort.
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

