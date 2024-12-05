import json
import random

# Esempi di domande e risposte per ogni categoria
esempi_domande = {
    "scienza": [
        {"domanda": "Qual è la formula chimica dell'acqua?", "corretta": "H2O", "opzioni": ["H2O", "O2", "CO2", "H2"]},
        {"domanda": "Quale pianeta è noto come il Pianeta Rosso?", "corretta": "Marte", "opzioni": ["Venere", "Giove", "Marte", "Saturno"]},
        {"domanda": "Quale dei seguenti sia un superconduttore ad alta temperatura?", "corretta": "YBCO", "opzioni": ["YBCO", "Mercurio", "Piombo", "Pompeo"]},
    ],
    "storia": [
        {"domanda": "In che anno è caduto l'Impero Romano d'Occidente?", "corretta": "476 d.C.", "opzioni": ["476 d.C.", "1492", "1789", "1945"]},
        {"domanda": "Chi ha scoperto l'America?", "corretta": "Cristoforo Colombo", "opzioni": ["Cristoforo Colombo", "Amerigo Vespucci", "Marco Polo", "Ferdinando Magellano"]},
        {"domanda": "In che anno è iniziata la Prima Guerra Mondiale?", "corretta": "1914", "opzioni": ["1914", "1918", "1939", "1945"]},
        
    ],
    "matematica": [
        {"domanda": "Quanto fa 12 x 8?", "corretta": "96", "opzioni": ["92", "96", "108", "112"]},
        {"domanda": "Quanto fa la radice quadrata di 144?", "corretta": "12", "opzioni": ["12", "14", "16", "18"]},
        {"domanda": "Quanto fa 12 x 8?", "corretta": "96", "opzioni": ["92", "96", "108", "112"]},
        {"domanda": "Quanto fa la radice quadrata di 144?", "corretta": "12", "opzioni": ["12", "14", "16", "18"]},

    ],
    "geografia": [
        {"domanda": "Qual è il fiume più lungo del mondo?", "corretta": "Rio delle Amazzoni", "opzioni": ["Nilo", "Yangtze", "Mississippi", "Rio delle Amazzoni"]},
        {"domanda": "Qual è la capitale della Francia?", "corretta": "Parigi", "opzioni": ["Parigi", "Berlino", "Madrid", "Roma"]},
        {"domanda": "In che stato si trova la città di Seattle?", "corretta": "Washington", "opzioni": ["California", "Washington", "New York", "Texas"]},
        {"domanda": "Qual è il lago più grande d'Italia?", "corretta": "Lago di Garda", "opzioni": ["Lago di Como", "Lago Maggiore", "Lago di Garda", "Lago Trasimeno"]},
    ],
    "arte": [
        {"domanda": "Chi ha dipinto 'L'urlo'?", "corretta": "Edvard Munch", "opzioni": ["Edvard Munch", "Vincent van Gogh", "Claude Monet", "Pablo Picasso"]},
        {"domanda": "Chi ha scritto 'Il Signore degli Anelli'?", "corretta": "J.R.R. Tolkien", "opzioni": ["J.R.R. Tolkien", "J.K. Rowling", "George Orwell", "Mark Twain"]},
        
    ],
    "fisica": [
        {"domanda": "Chi ha scoperto la radioattività?", "corretta": "Henri Becquerel", "opzioni": ["Henri Becquerel", "Marie Curie", "Wilhelm Röntgen", "Isaac Newton"]},
        {"domanda": "Quale dei seguenti sia un superconduttore ad alta temperatura?", "corretta": "YBCO", "opzioni": ["YBCO", "Mercurio", "Piombo", "Pompeo"]},
        
    ],
    "attualita": [
        {"domanda": "In che anno è stata fondata Apple?", "corretta": "1976", "opzioni": ["1976", "1975", "1977", "1980"]},
        {"domanda": "Chi è il presidente degli Stati Uniti?", "corretta": "Joe Biden", "opzioni": ["Joe Biden", "Donald Trump", "Barack Obama", "George W. Bush"]},
        {"domanda": "Qual è il nome del vaccino contro il COVID-19 sviluppato da Pfizer e BioNTech?", "corretta": "Comirnaty", "opzioni": ["Comirnaty", "Moderna", "AstraZeneca", "Sputnik V"]},
        {"domanda": "Qual è il nome del rover della NASA atterrato su Marte nel 2021?", "corretta": "Perseverance", "opzioni": ["Curiosity", "Perseverance", "Opportunity", "Spirit"]},
    ],
    "sport": [
        {"domanda": "Quale giocatore ha vinto più Champions League?", "corretta": "Cristiano Ronaldo", "opzioni": ["Cristiano Ronaldo", "Lionel Messi", "Kylian Mbappe", "Luka Modric"]},
    ],
    "musica": [
    {"domanda": "Chi ha scritto 'Bohemian Rhapsody'?", "corretta": "Freddie Mercury", "opzioni": ["Freddie Mercury", "John Lennon", "Elton John", "David Bowie"]},
    {"domanda": "Quale strumento suona Ludwig van Beethoven?", "corretta": "Pianoforte", "opzioni": ["Violino", "Pianoforte", "Chitarra", "Flauto"]}
    ],
    # Aggiungi altre categorie e domande qui...
}

# Difficoltà e tipi di domande
difficolta = ["easy", "medium", "hard", "extreme"]
tipo_domanda = ["multiple", "true_false"]

# Genera le domande
domande = []
id_counter = 1

while len(domande) < 2000:
    categoria = random.choice(list(esempi_domande.keys()))
    difficolta_scelta = random.choice(difficolta)
    tipo = random.choice(tipo_domanda)
    
    esempio = random.choice(esempi_domande[categoria])
    
    if tipo == "multiple":
        domanda = {
            "id": id_counter,
            "categoria": categoria,
            "domanda": esempio["domanda"],
            "difficoltà": difficolta_scelta,
            "tipo": tipo,
            "opzioni": esempio["opzioni"],
            "risposta_corretta": esempio["corretta"]
        }
    else:  # true_false
        risposta_corretta = "vero" if random.choice([True, False]) else "falso"
        domanda = {
            "id": id_counter,
            "categoria": categoria,
            "domanda": esempio["domanda"] + " (vero o falso?)",
            "difficoltà": difficolta_scelta,
            "tipo": tipo,
            "risposta_corretta": risposta_corretta
        }
    
    domande.append(domanda)
    id_counter += 1

# Salva in un file JSON
with open("domande.json", "w", encoding="utf-8") as f:
    json.dump(domande, f, indent=4, ensure_ascii=False)

print("File JSON con 2000 domande generato con successo!")
