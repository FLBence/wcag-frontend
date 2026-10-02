# WCAG 2.1 Webes akadálymentességi elemző és javító rendszer - Frontend

A rendszer Angular (TypeScript) és Tailwind CSS alapú webes felülete, amely interaktív felületet, riportokat, valamint AI által generált kód-diff nézetet biztosít a felhasználók és fejlesztők számára.

## Technológiai leírás
* **Keretrendszer:** Angular (v17+)
* **Nyelv:** TypeScript
* **Stílus & UI:** Tailwind CSS, Lucide / Heroicons komponensek
* **Csomagkezelő:** npm

## Előfeltételek (Prerequisites)
A projekt futtatásához az alábbiak szükségesek a gépeden:
* **Node.js:** v18.x vagy v20.x LTS
* **npm:** v9.x vagy újabb
* **Angular CLI:** `npm install -g @angular/cli`

## Beállítás és Futtatás

### 1. Függőségek telepítése
A projekt gyökérkönyvtárában add ki a következő parancsot:
```bash
npm install
```

### 2. Fejlesztői szerver indítása
```bash
ng serve
```

Nyisd meg a böngészőben a `http://localhost:4200/` címet. Az alkalmazás automatikusan újraindul, ha módosítod a forráskódot.

### 3. Backend csatlakozás
A frontend alapértelmezetten a `http://localhost:8080/api` címen futó Spring Boot REST API-hoz kapcsolódik. Győződj meg róla, hogy a backend szolgáltatás fut az alkalmazás használata előtt!

## 🔗 Kapcsolódó Repo
* **Backend API (Spring Boot):** [wcag-backend](https://github.com/FLBence/wcag-backend.git)