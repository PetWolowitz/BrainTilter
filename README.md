Funzionalità Principali
1. Sistema di Livelli
Configurazione Livelli:
Ogni livello ha una difficoltà, un tempo limite, un punteggio minimo richiesto e un numero massimo di domande.
Ogni livello completato sblocca un premio unico (es. "Bronze Rookie", "Silver Master").
Transizione tra Livelli:
Se il punteggio minimo è raggiunto, si passa al livello successivo.
L'utente può visualizzare un messaggio di congratulazioni e il premio sbloccato.
2. Domande Randomizzate
Logica delle Domande:
Le domande vengono caricate da un file JSON locale o dall'API Open Trivia (per la lingua inglese).
Vengono filtrate per livello di difficoltà e randomizzate con un algoritmo di shuffle.
Ogni domanda include opzioni multiple che vengono anch'esse randomizzate.
Sistema Anti-Ripetizione:
Le domande già utilizzate vengono salvate in un Set per evitarne la ripetizione.
3. Feedback e Animazioni
Feedback Corretto/Sbagliato:
Animazioni visive (motion.div) mostrano feedback immediato con messaggi come "Corretto!" o "Sbagliato!".
Game Over:
Quando l'utente commette troppi errori in un livello, viene visualizzata una schermata di Game Over con un pulsante per ricominciare.
Transizioni Livelli:
Animazioni di transizione fluide per passare al livello successivo o alla schermata di Game Over.
4. Gestione degli Errori
Tracciamento Errori:
Ogni difficoltà ha un limite massimo di errori (es. 2 errori).
Se il limite viene superato, il gioco termina.
Contatore Errori:
Un contatore visivo (ErrorCounter) mostra gli errori attuali rispetto al massimo consentito.
5. Supporto Multilingua
Lingue Disponibili:
Italiano (default) e Inglese.
Caricamento delle Domande:
Per l'italiano, le domande sono prese da un file JSON locale.
Per l'inglese, le domande sono caricate dall'API Open Trivia.
6. Effetti Sonori
Suoni Personalizzati:
Suono di successo per le risposte corrette.
Suono di errore per le risposte sbagliate.
Suono di Game Over in caso di fine livello per errori.
Come Funziona
Avvio del Quiz:

L'utente inizia al livello 1 con un set di domande randomizzate.
Ogni domanda ha un limite di tempo specifico.
Risposta alle Domande:

L'utente seleziona una risposta tra le opzioni.
Il punteggio e gli errori vengono aggiornati immediatamente.
Transizione dei Livelli:

Quando il punteggio minimo richiesto è raggiunto, l'utente passa al livello successivo.
Se il limite di errori è superato, il gioco termina.
Game Over e Restart:

Alla fine del gioco, l'utente può cliccare "Prova Ancora" per ricominciare dall'inizio.
Struttura del Codice
Componenti Principali:
App.jsx: Contiene la logica del gioco, caricamento delle domande, gestione dei livelli e rendering delle schermate principali.
QuestionCard.jsx: Visualizza le domande e le opzioni.
GameOver.jsx: Schermata che appare quando il gioco termina.
ErrorCounter.jsx: Mostra il numero di errori per il livello corrente.
Modifiche Implementate
Shuffle Migliorato:
Algoritmo di shuffle per garantire casualità affidabile per domande e opzioni.
Gestione Domande:
Correzione di errori nel caricamento delle domande dal file JSON.
Backup automatico delle domande locali in caso di errore nell'API.
Fix Animazioni:
Modificato lo z-index e il layout per evitare che le animazioni interferissero con i pulsanti.
Gestione Multilingua:
Integrazione delle domande locali e dell'API Open Trivia per supportare le due lingue.
