# TrollingPro 2

Vetouistelun syvyyslaskin ja sivuprofiili. Näyttää yhdellä silmäyksellä, missä uistimet
oikeasti kulkevat: siiman muoto, uistimen syvyys ja etäisyys veneen perässä, oikeassa
mittakaavassa. Yksi HTML-tiedosto, ei riippuvuuksia, ei palvelinta.

Kuva on 1:1 mittakaavassa sekä pysty- että vaakasuunnassa: syvyysakseli 0–12 m,
vaaka-akseli 100 ft. Vain uistin- ja painosymbolit on suurennettu näkyviksi.

## Sisältö

| Tiedosto | Mitä tekee |
|---|---|
| `index.html` | Koko sovellus |
| `manifest.webmanifest` | Kotivalikkoon asennus |
| `sw.js` | Offline-käyttö järvellä |
| `kuvake-192.png`, `kuvake-512.png` | Sovelluskuvake |

## Julkaisu GitHub Pagesiin

1. Luo GitHubissa uusi julkinen varasto, esimerkiksi `trollingpro`.
2. **Add file → Upload files**, raahaa kaikki viisi tiedostoa varaston juureen ja
   **Commit changes**. `index.html` pitää olla juuressa, ei alikansiossa.
3. **Settings → Pages**. Kohtaan *Source* valitse **Deploy from a branch**, haaraksi
   `main` ja kansioksi `/ (root)`. **Save**.
4. Muutaman minuutin päästä sovellus on osoitteessa
   `https://lohirosvo.github.io/trollingpro/`.
5. Avaa osoite puhelimella ja lisää se kotivalikkoon. Androidilla Chromen valikosta
   *Lisää aloitusnäyttöön*, iPhonella Safarin jakovalikosta *Lisää Koti-valikkoon*.
   Sen jälkeen se avautuu ilman selaimen palkkeja ja toimii ilman verkkoyhteyttä.

Jos haluat sen mieluummin nykyisen `uistelututka`-varaston alle, laita tiedostot
kansioon `trollingpro/`, jolloin osoite on
`https://lohirosvo.github.io/uistelututka/trollingpro/`.

GPS ja kotivalikkoon asennus vaativat HTTPS:n. GitHub Pages antaa sen automaattisesti.
Suoraan tiedostosta (`file://`) avattuna sovellus toimii muuten, mutta GPS ei.

### Päivittäminen

Kun muutat `index.html`:ää, nosta myös `sw.js`:n ensimmäisellä rivillä olevaa
`CACHE`-numeroa (`trollingpro-v1` → `trollingpro-v2`). Muuten puhelin tarjoilee vanhaa
välimuistiversiota.

## Miten laskenta toimii

Siiman muoto integroidaan uistimelta venettä kohti. Jokaisella pätkällä lasketaan
paikallinen kulma pystysuorasta siitä, miten alaspäin vaikuttava voima ja taaksepäin
vaikuttava voima ovat tasapainossa.

**Alaspäin:** lyijypainon nettopaino vedessä, uistimen oma nettopaino ja vaapun lipan
tuottama voima.

**Taaksepäin:** uistimen ja painon vedenvastus sekä siiman oma vastus. Siimalle
lasketaan sekä poikittainen painevastus (`v·cos θ`) että pituussuuntainen kitkavastus
(`v·sin θ`). Molempien pystykomponentti vähentää alaspäin vaikuttavaa voimaa siimaa
ylöspäin seurattaessa — juuri tästä syystä ohut siima ui syvemmälle ja pitkä siima
loppua kohti loivenee.

Vaapun lippaa ei käsitellä metreinä vaan voimana. Uistimen ilmoitetusta uintisyvyydestä
(tai sukelluskäyrästä) ratkaistaan puolitushaulla se voima, jolla malli osuu annettuun
syvyyteen vertailuolosuhteissa, ja tämä voima skaalataan nopeuden neliöllä. Siksi
laskenta osuu käyrään täsmälleen ilman painoa ja käyttäytyy järkevästi painon kanssa:
lyijyn vaikutus on painovoimaa eikä skaalaudu nopeuden mukana, joten painollinen veto
madaltuu vauhdin kasvaessa — vaappu yksinään ei juuri madallu.

Uistinkirjaston oletuksena on sukelluskäyrä Rapala Husky Jerk HJ08 -kortista
(Precision Trolling, 10 lb monofiili = 0,343 mm).

### Kellunta

Uistimelle valitaan kelluva, suspending tai uppoava. Ero näkyy nimenomaan hitaassa
vedossa: kelluvan uistimen noste on vakio, lipan voima kasvaa neliöllisesti, joten
vauhdin hiipuessa uistin nousee. Suspending-uistimella syvyys on lähes
nopeusriippumaton. Kelluvan vaapun nosteen suuruus on asetettavissa prosentteina
uistimen omasta painosta.

## Kalibrointi

Sukelluskäyrä sitoo vain vaapun oman uinnin. Se ei kerro, miten syvälle lyijypaino vie
saman uistimen — se riippuu uistimen absoluuttisesta vedenvastuksesta, jota mikään
taulukko ei anna. Malli arvaa sen uistimen painosta, ja tämä arvaus kannattaa korvata
yhdellä mittauksella.

1. Vedä tunnetun syvyisen paikan yli ja etsi asetelma, jolla uistin juuri raapaisee
   pohjaa. Kirjaa siiman määrä, paino, nopeus ja pohjan syvyys.
2. Kalusto-välilehti → *Kalibrointi mittauksella* → syötä luvut → *Ratkaise uistimen
   vetovastus*.
3. Malli sovittaa kyseisen uistimen vastuksen niin, että veto osuu. Sukelluskäyrä pysyy
   voimassa, koska lipan voima lasketaan samalla uudelleen.

Yksi hyvä havainto siirtää koko taulukon oikeaan asentoon. Tee kalibrointi erikseen
jokaiselle uistimelle, jota käytät painojen kanssa.

## Mitä malli ei tee

- Ei planereita, syvyystasaimia (dipsy) eikä downriggeriä.
- Ei lyijysydänsiimaa; siiman oma paino oletetaan mitättömäksi, mikä pätee monofiilille
  ja kuidulle mutta ei lyijysydämelle.
- Ei virtausta, tuulen aiheuttamaa sivuajautumista eikä käännösten vaikutusta. Käännöksessä
  sisäkaaren uistin nousee ja ulkokaaren syvenee, tätä laskenta ei tunne.
- Ei veden lämpötilakerrostumaa.

Luvut ovat mallin arvioita. Ne ovat sitä parempia mitä lähempänä kalibrointipistettä
liikutaan.

## Lisenssi

MIT, ks. `LICENSE`.
