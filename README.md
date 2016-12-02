# Receptgyűjtemény (alkfejl)

## Telepítés
```
# Linux:
npm install
./ace migration:run

# Windows:
npm install
node ace migration:run
copy .env.example .env
```

## Használat
```
npm run dev
```

## Terv

Modell:

- receptek kategória szerint
- kategóriák fixek (db-ben)
- recept - ingredients (1-N?)
- user - recept
- kedvenc (N-N) bónusz

Vendég:

- nyitóoldal (menü)
  - receptajánlók kategóriánként (top 3)
- böngésző: kategória + lapozható lista
- keresés: szűrőmezőkkel, találati lista
- recept megjelenítés

Felhasználó:

- új recept
  - 10dkg marha oldalas
  - 1kávéskanál
  - liszt ízlés szerint
- módosítás
- törlés/inaktiválás
- kedvenc bónusz
- profil
  - saját receptek
  - kedvencek bónusz
  - user adatok



## Követelményspecifikáció

### Funkcionális követelmények

- Vendégként a főoldalon szeretnék kiemelt recepteket látni kategóriánként.
- Vendégként szeretnék a receptek között szabadon böngészni.
- Vendégként szeretnék egy receptleírást megtekinteni.
- Vendégként szeretnék receptet keresni.
- Vendégként szeretnék tudni regisztrálni az oldalra.
- Felhasználóként szeretnék tudni bejelentkezni az oldalra.
- Felhasználóként szeretném tudni a profiladataimat szerkeszteni.
- Felhasználóként szeretnék új receptet beküldeni.
- Felhasználóként szeretném a saját recpetjeimet módosítani vagy törölni.

### Nem funkcionális követelmények

- Felhasználóbarát, ergonomikus elrendezés és kinézet.
- Gyors működés.
- Biztonságos működés: jelszavak tárolása, funkciókhoz való hozzáférés.

## Szakterületi fogalomjegyzék

- Recept: étel elkészítéséhez szükséges hozzávalók és az elkészítés lépéseit tartalmazó leírás.

## Használatieset-Modell

### Szerepkörök

- vendég: receptek keresését, böngészését és megtekintését végezheti.
- felhasználó: a vendég szerepkörén túl a saját receptjeinek kezelésére (új, módosít, törlés) képes.

### Használatieset-diagram

```
#direction: right
[<actor>vendég] - [<usecase>főoldal]
[<actor>vendég] - [<usecase>receptek böngészése]
[<actor>vendég] - [<usecase>recept megtekintése]
[<actor>vendég] - [<usecase>keresés]
[<actor>vendég] - [<usecase>regisztrálás]
[<actor>felhasználó] --> [<actor>vendég]
[<actor>felhasználó] - [<usecase>bejelentkezés]
[<actor>felhasználó] - [<usecase>kijelentkezés]
[<actor>felhasználó] - [<usecase>új recept beküldése]
[<actor>felhasználó] - [<usecase>saját receptek kezelése]
[<actor>felhasználó] - [<usecase>profiladatok megtekintése]
[<usecase>profiladatok megtekintése] <<extends>><-- [<usecase>profiladatok szerkesztése]
```

![Használatieset-diagram](docs/use_case.png)

### Folyamatok meghatározása

UML Activity Diagram

- felhasználó
    + új recept felvételének folyamata

        ```
        #direction: right
        [<start>start] -> [<state>saját receptek]
        [<state>saját receptek] -> [<state>új recept]
        [<state>új recept] -> [<state>előnézet]
        [<state>előnézet] -> [<choice>megfelelő?]
        [<choice>megfelelő?] nem-> [<state>új recept]
        [<choice>megfelelő?] igen-> [<state>recept megtekintése]
        [<state>recept megtekintése] -> [<end>end]
        ```
    
        ![Új recept folyamata](docs/uj_recept_uml.png)

    + bejelentkezés folyamata

        ```
        #direction: right
        [<start>start] -> [<state>főoldal]
        [<state>főoldal] -> [<state>bejelentkezés]
        [<state>bejelentkezés] -> [<choice>sikeres?]
        [<choice>sikeres?] nem-> [<state>bejelentkezés]
        [<choice>sikeres?] igen-> [<state>saját receptek]
        [<state>saját receptek] -> [<end>end]
        ```

        ![Bejelentkezés](docs/bejelentkezes_uml.png)

- vendég
    + keresés egy receptre

## Végpontok

- `GET /`: főoldal
- `GET /login`: bejelentkező oldal
- `POST /login`: bejelentkezési adatok felküldése
- `GET /profile`: profiladatok
- `GET /recipes`: receptlista
- `GET /recipes/:id`: recept megtekintése
- `GET /recipes/create`: új recept felvitele, űrlap megjelenítése
- `POST /recipes/create`: új recept felvitele, adatok küldése

## Oldalvázlatok (mockup)

![Főoldal](docs/fooldal.png)

![Böngészés](docs/bongeszes.png)

![Recept megtekintése](docs/recept.png)

![Új recept](docs/uj_recept.png)


## Sitemap

Publikus:

- Főoldal
- Receptek böngészése
    + Recept megtekintése
- Belépés
- Regisztráció

Felhasználó

- Kilépés
- Profiladatok
    + Profiladatok szerkesztése
- Új recept felvitele

## Adatmodell

```
[User|
  felhasználónév
  email
  jelszó
]

[Recipe|
  név
  hozzávalók
  leírás
]

[Category|
  név
]

[User] 1 - 0..* [Recipe]
[Category] 1 - 0..* [Recipe]
```

![Adatmodell](docs/data_model.png)

## Állapotdiagramok

Egyelőre nincs a feladatban.

Ötlet: új recept, előnézet vagy jóváhagyási fázis

## Designtervek

Kihagyható, rögtön Bootstrapben csinálni.

- [LayoutIt](http://www.layoutit.com/build)
- [Bootswatch](http://bootswatch.com/)




