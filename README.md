# Aplikacja Kontakty

Pełnoprawna aplikacja do zarządzania kontaktami, kategoriami i podkategoriami. Projekt składa się z dwóch głównych komponentów:

1. **ContactsFrontend**: Frontend oparty na Angularze do interakcji z użytkownikiem.
2. **ContactsBackend**: Backend API oparty na .NET 9.0 do zarządzania danymi i uwierzytelniania.

---

## Spis Treści

- [Funkcje](#funkcje)
- [Użyte Technologie](#użyte-technologie)
- [Struktura Projektu](#struktura-projektu)
- [Przegląd Frontendu](#przegląd-frontendu)
- [Przegląd Backend](#przegląd-backend)
- [Docker](#docker)
- [Ręczna Konfiguracja i Kompilacja](#ręczna-konfiguracja-i-kompilacja)
- [Endpointy API](#endpointy-api)

---

## Funkcje

- Uwierzytelnianie użytkowników (rejestracja i logowanie) za pomocą JWT.
- Operacje CRUD dla kontaktów.
- Zarządzanie kategoriami i podkategoriami.
- Angular Material dla komponentów UI.
- Baza danych SQLite do przechowywania danych.
- Docker do wdrażania zarówno frontendu, jak i backendu.

---

## Użyte Technologie

### Frontend

- **Angular 19.2**
- **Angular Material** dla komponentów UI.

### Backend

- **.NET 9.0** z ASP.NET Core.
- **Entity Framework Core** do zarządzania bazą danych.
- **SQLite** jako baza danych.
- **JWT** do uwierzytelniania.
- **Swagger** do dokumentacji API.

### Wdrażanie

- **Docker** do konteneryzacji.

---

## Struktura Projektu

### Frontend

- `ContactsFrontend/src/app`: Zawiera komponenty Angulara, serwisy i modele.
- `ContactsFrontend/src/styles.scss`: Globalne style.
- `ContactsFrontend/Dockerfile`: Konfiguracja Dockera dla frontendu.

### Backend

- `ContactsBackend/Controllers`: Kontrolery API do obsługi żądań.
- `ContactsBackend/Models`: Modele danych aplikacji.
- `ContactsBackend/Data`: Kontekst bazy danych i inicjalizator.
- `ContactsBackend/Dockerfile`: Konfiguracja Dockera dla backendu.

---

## Przegląd Frontendu

### Kluczowe Komponenty

- **`ContactsListComponent`**: Wyświetla listę kontaktów.
- **`ContactDetailComponent`**: Obsługuje dodawanie i edytowanie kontaktów.
- **`LoginComponent`**: Zarządza logowaniem i rejestracją użytkowników.

### Serwisy

- **`ContactsService`**: Obsługuje wywołania API dla kontaktów, kategorii i podkategorii.
- **`AuthService`**: Zarządza uwierzytelnianiem i przechowywaniem tokenów.

### Stylizacja

- SCSS jest używany do stylizacji, a Angular Material dostarcza gotowe motywy.

---

## Przegląd Backend

### Kluczowe Kontrolery

- **`AuthController`**: Obsługuje rejestrację i logowanie użytkowników.
- **`ContactsController`**: Zarządza operacjami CRUD dla kontaktów.
- **`CategoriesController`**: Udostępnia endpointy dla kategorii.
- **`SubcategoriesController`**: Udostępnia endpointy dla podkategorii.

### Modele

- **`Contact`**: Reprezentuje kontakt.
- **`Category`**: Reprezentuje kategorię z opcjonalnymi podkategoriami.
- **`Subcategory`**: Reprezentuje podkategorię powiązaną z kategorią.
- **`ApplicationUser`**: Rozszerza `IdentityUser` do uwierzytelniania użytkowników.

### Baza Danych

- **`ApplicationDbContext`**: Zarządza interakcjami z bazą danych za pomocą Entity Framework Core.
- **`DbInitializer`**: Wprowadza początkowe dane dla kategorii i podkategorii.

---

## Docker

Uwaga:
- Swagger jest wyłączony dla środowiska produkcyjnego (Docker)

1. Wygeneruj certyfikat:

```bash
mkdir certs && dotnet dev-certs https -ep ./certs/aspnetapp.pfx -p "devpassword"  
```

2. Zbuduj i uruchom kontenery:

   ```bash
   docker-compose up --build
   ```

3. Uzyskaj dostęp do frontendu pod adresem `https://localhost:4200` i backendu API pod adresem `https://localhost:5102`.

## Ręczna Konfiguracja i Kompilacja

### Wymagania Wstępne

- **Node.js** i **npm** dla frontendu.
- **.NET SDK 9.0** dla backendu.
- **Docker** do konteneryzacji.

### Frontend

1. Przejdź do `ContactsFrontend`.
2. Zainstaluj zależności:

   ```bash
   npm install
   ```

3. Uruchom serwer deweloperski:

   ```bash
   npm start
   ```

4. Otwórz aplikację w przeglądarce pod adresem `https://localhost:4200`.

### Backend

1. Przejdź do `ContactsBackend`.
2. Przywróć zależności:

   ```bash
   dotnet restore
   ```

3. Uruchom aplikację:

   ```bash
   dotnet run
   ```

4. API będzie dostępne pod adresem `https://localhost:5102`.

---

## Endpointy API

Pliki .http z testami endpointów są dostępne w folderze ContactsBackend

### Uwierzytelnianie

- **POST** `/api/auth/register`: Rejestracja nowego użytkownika.
- **POST** `/api/auth/login`: Logowanie i otrzymanie tokena JWT.

### Kontakty

- **GET** `/api/contacts`: Pobierz wszystkie kontakty.
- **POST** `/api/contacts`: Utwórz nowy kontakt (wymaga uwierzytelnienia).
- **PUT** `/api/contacts/{id}`: Zaktualizuj kontakt (wymaga uwierzytelnienia).
- **DELETE** `/api/contacts/{id}`: Usuń kontakt (wymaga uwierzytelnienia).

### Kategorie

- **GET** `/api/categories`: Pobierz wszystkie kategorie.
- **GET** `/api/categories/{id}`: Pobierz konkretną kategorię.

### Podkategorie

- **GET** `/api/subcategories`: Pobierz wszystkie podkategorie.
- **GET** `/api/subcategories/category/{categoryId}`: Pobierz podkategorie dla konkretnej kategorii.
