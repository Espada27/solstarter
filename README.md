# 🚀 Solstarter 🚀

# Introduction

Solstarter est une plateforme décentralisée de crowdfunding.
Contribuez aux projets qui vous plaisent, lancez votre propre idée et partez à la récolte de financements !
La nouveauté de Solstarter est la possibilité de revendre sa contribution et l'avantage qui lui est associé sur le marché secondaire.

# 🔗Liens Utiles

✅ Déployé sur Vercel : <https://solstarter-tawny.vercel.app/>

✅ Program deployé sur Solana Devnet : [Solana explorer link](https://explorer.solana.com/address/EPYqwH4n7Eu8n8NAwr1PorvsNJsjLfJDaQ7Q9QXxX8fX?cluster=devnet)

## 👨‍💻Équipe de Développement

Jérôme JULIEN  
Benjamin POULINET  
Jonathan DUGARD

# Stack Technique

## 🖥️Backend (Program)

Le program a été implémenté en utilisant le framework Anchor, outil de développement Solana

### Tests Anchor
Fichiers de tests : <https://github.com/Espada27/solstarter/tree/main/anchor/tests>

Exécution : 
```$ npm run anchor test```

# 🛠️Architecture

Monorepo architecture generate with [create-solana-dapp](https://www.npmjs.com/package/create-solana-dapp/v/3.0.5) ```3.0.5```

## Backend

- Anchor ```0.30.1```
- Rust ```1.79.0```
- Jest
- Cargo

## Frontend

- NextJS
- Tailwind CSS / daisyUI
- Solana JavaScript SDK (web3.js) ```1.91.9```
- Anchor ```0.30.1```
- React query pour la gestion des appels async au program
- Solana Actions (Blinks)
