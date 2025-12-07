# 📘 Aplikacja „Cytaty Motywacyjne” — Backend (Nest.js + PostgreSQL)

**Autor:** Bartosz Zając  
**Nr albumu:** 177190  
**Laboratorium:** 5–7  
**Repozytorium:** https://github.com/DarkSourcerer-SWMG/aplikacja-cytaty-motywacyjne

## 🎯 Opis projektu
Aplikacja backendowa dostarczająca krótkie **cytaty motywacyjne** — losowe, filtrowane oraz zarządzalne przez moderatorów. Projekt może służyć użytkownikom końcowym (np. aplikacje mobilne, boty), jak również administratorom odpowiedzialnym za zarządzanie treścią.

System udostępnia API REST, obsługuje CRUD na encjach **Quote**, **Author**, **Tag**, umożliwia filtrowanie, wyszukiwanie tekstowe oraz import danych.

---

## 🧑‍🏫 Dla kogo?
- **Użytkownicy końcowi** — szybkie pobranie cytatu (losowego lub wyszukiwanego).
- **Moderatorzy / redaktorzy** — dodawanie, edytowanie i usuwanie cytatów.
- **Integratorzy** — aplikacje mobilne, boty, serwisy internetowe.

---

## 🚀 Funkcjonalności (CRUD dla 3 encji)
### **Quote**
- Create / Read (pojedynczy, lista, losowy, filtracja) / Update / Delete  
- Obsługa tagów, autorów i języków  
- FTS / wyszukiwanie tekstowe

### **Author**
- Dodawanie, odczyt, edycja, usuwanie autorów  
- Powiązanie cytatów z autorami

### **Tag**
- Dodawanie, odczyt, edycja, usuwanie tagów  
- Lista tagów z licznikami

---

## 📝 User Stories
- *Jako anonimowy użytkownik* chcę zobaczyć **losowy cytat**, aby szybko się zmotywować.  
- *Jako użytkownik* chcę wyszukać cytaty zawierające słowo „sukces”, aby znaleźć odpowiednią inspirację.  
- *Jako moderator* chcę dodać, edytować i usuwać cytaty, aby utrzymać wysoką jakość treści.

---

## 🛠️ Technologie

### **Backend**
- **TypeScript**
- **Nest.js**
- **Prisma ORM**
- **PostgreSQL**
- **Docker / docker-compose**

---

## 🗄️ Model danych (ERD – opis)

### **quotes**
| Pole | Typ | Opis |
|------|------|------|
| id | UUID PK | identyfikator |
| text | TEXT NOT NULL | treść cytatu |
| author_id | UUID FK | powiązany autor |
| tags | TEXT[] / JSONB | tagi |
| source | VARCHAR(255) | źródło |
| language | VARCHAR(8) | język |
| created_at | timestamptz | data dodania |
| updated_at | timestamptz | data aktualizacji |
| import_hash | VARCHAR | deduplikacja |
| is_deleted | BOOLEAN | miękkie usunięcie |

### **authors**
| Pole | Typ |
|------|------|
| id | UUID PK |
| name | VARCHAR(255) NOT NULL |
| bio | TEXT nullable |
| created_at | timestamptz |

### **tags**
| Pole | Typ |
|------|------|
| id | UUID PK |
| name | VARCHAR(100) UNIQUE |

---

## 🔌 Kontrakt API (REST)

Wszystkie odpowiedzi w formacie JSON.  
Autoryzacja: `Authorization: Bearer <token>` (dla operacji modyfikujących).

### **1. GET /api/v1/quotes/random**
Query: `tag`, `author`, `lang`  
**200:** `Quote`

### **2. GET /api/v1/quotes**
Query: `page`, `limit`, `tag`, `author`, `q`, `lang`, `sort`  
**200:** `{ items: Quote[], meta }`

### **3. GET /api/v1/quotes/:id**
**200:** `Quote`  
**404:** `{ error }`

### **4. POST /api/v1/quotes** *(auth)*
Body: `{ text, authorId?, tags?, language?, source? }`  
**201:** Created

### **5. PUT /api/v1/quotes/:id** *(auth)*  
**200:** Updated `Quote`

### **6. DELETE /api/v1/quotes/:id** *(auth)*  
**204:** No Content

### **7. GET /api/v1/authors**
Query: `page`, `limit`, `q`

### **8. POST /api/v1/authors** *(auth)*

### **9. GET /api/v1/tags**
Lista tagów + liczba użyć

---

## 🐳 Docker (docker-compose)

Przykładowy `docker-compose.yml`:

```yaml
version: "3.9"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: quotes
      POSTGRES_DB: quotesdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db

volumes:
  postgres_data:
