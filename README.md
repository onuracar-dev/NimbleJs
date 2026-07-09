<div align="center">
  <a href="#english">English</a> | <a href="#türkçe">Türkçe</a>
</div>

<h1 id="english">NimbleJS ⚡</h1>

**NimbleJS** is an ultra-lightweight, agile, flexible, and framework-agnostic *Signals (Reactivity)* and State Management library designed for modern web applications.

## Project Snapshot

NimbleJS is a small TypeScript reactivity toolkit built around signals, computed values, stores, and plugins. It is useful as a portfolio piece because it shows framework-level thinking: dependency tracking, cleanup behavior, plugin APIs, persistence, and package build discipline.

- **Core idea:** fine-grained state updates without committing to React, Vue, or another UI framework.
- **Recent hardening:** added Vitest coverage for reactivity and persistence, and made the persist plugin safe for non-browser runtimes by accepting explicit storage.
- **Validation:** `npm test` and `npm run build`.

It works flawlessly with Vanilla JS or Web Components directly, without any framework dependency (React, Vue, Angular, etc.). It can also be easily integrated into any framework whenever you need it.

---

## 🌟 Features

- **Core Reactivity (Signals):** Track variables; when the value changes, only the functions (effects) that depend on that value are re-executed.
- **Derived State (Computed):** Smart, automatically calculated and cached values that depend on other signals.
- **Performance & Memory Friendly:** Thanks to advanced "Two-Way Dependency Tracking", unused subscriptions are automatically cleaned up. It does not cause Memory Leaks.
- **Plugin System:** The NimbleJS core is very small, but it can be expanded with powerful plugins:
  - 💾 **Persist Plugin:** Automatically saves and restores state changes to `localStorage`.
  - ⏪ **History Plugin:** Tracks changes to add "Undo" and "Redo" features to your application with a single line of code.
- **Type Safety:** Written entirely in TypeScript, providing flawless IDE support.

---

## 🎯 Who is it for?

- **Vanilla JS Developers:** Those who do not want to add large frameworks like React/Vue to their project but need modern "Reactive State" management.
- **Micro Front-End and Web Components Developers:** Those who want to establish a fast and lightweight data bridge between components.
- **Performance-Oriented Projects:** Engineers who want to avoid unnecessary renders and only reflect changed data to the DOM (Fine-grained reactivity).

---

## 🚀 Installation

It's very easy to include NimbleJS in your project:

```bash
# with npm
npm install nimblejs

# with yarn
yarn add nimblejs

# with pnpm
pnpm add nimblejs
```

---

## 📖 Basic Usage

NimbleJS reduces state management to its simplest possible form.

### 1. Signals and Effects

A `signal` holds a reactive value. An `effect` listens to changes in the signal and reacts to them.

```typescript
import { signal, effect } from 'nimblejs';

// 1. Create a reactive variable
const count = signal(0);

// 2. Define a side effect. 
// This function runs immediately and automatically subscribes to the signals inside it.
const unsubscribe = effect(() => {
  console.log(`Current count value: ${count.value}`);
});
// Output: "Current count value: 0"

// 3. When you update the value, the effect is automatically triggered again
count.value = 1; 
// Output: "Current count value: 1"

// You can stop the effect when you are done (Prevents memory leak)
unsubscribe();
```

### 2. Derived Values (Computed)

You can create derived values that feed from other signals and update automatically.

```typescript
import { signal, computed, effect } from 'nimblejs';

const price = signal(100);
const taxRate = signal(0.18);

// totalPrice automatically updates when price or taxRate changes
const totalPrice = computed(() => price.value + (price.value * taxRate.value));

effect(() => {
  console.log(`Total Price: $${totalPrice.value}`);
});
// Output: "Total Price: $118"

price.value = 200;
// Output: "Total Price: $236"
```

---

## 🛠️ Advanced Usage (Store and Plugins)

For larger projects, you can use the `Store` structure to keep states together. The Store structure allows you to use NimbleJS's awesome plugins (Undo/Redo, LocalStorage).

```typescript
import { createStore, effect, persist, withHistory } from 'nimblejs';

// 1. Create a centralized Store
const appStore = createStore('myApp', {
  username: 'Guest',
  theme: 'light'
});

// 2. (Optional) Persist Plugin: Save state to LocalStorage
persist(appStore);

// 3. (Optional) History Plugin: Add Undo/Redo feature
const history = withHistory(appStore, { maxHistory: 20 });

// Listen for changes
effect(() => {
  document.body.className = appStore.state.theme.value;
  document.getElementById('user').innerText = appStore.state.username.value;
});

// Update values (Automatically saved to LocalStorage and added to History)
appStore.state.theme.value = 'dark';
appStore.state.username.value = 'Onur';

// Made a mistake? Undo it!
document.getElementById('undo-btn').addEventListener('click', () => {
  if (history.canUndo) {
    history.undo(); // Theme becomes 'light' again, Username becomes 'Guest' again.
  }
});
```

---

## 🧠 How it Works (Architectural Details)

Under the hood, NimbleJS uses **Two-Way Dependency Tracking**.
In old-school reactive libraries, when an `effect` started listening to a signal, it remained subscribed to that signal forever (Memory Leak).

In NimbleJS, however, every time an `effect` runs, it first cleans itself up from all its old subscriptions (cleanup), and then re-subscribes only to the signals it reads during that specific run. This way, changing dependencies between `if/else` blocks are managed perfectly and smoothly.

---

## 🤝 Contributing

This project is open source! Bug reports (issues), new feature requests, and Pull Requests (PRs) are highly appreciated.
To run the project locally:

```bash
git clone https://github.com/your-username/nimblejs.git
cd nimblejs
npm install
npm run dev # Starts the demo page
```

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it as you wish.

<br>
<br>

---
---

<h1 id="türkçe">NimbleJS ⚡ (Türkçe)</h1>

**NimbleJS**, modern web uygulamaları için tasarlanmış; ultra hafif, çevik, esnek ve framework-bağımsız (agnostic) bir *Signals (Reactivity)* ve State Management kütüphanesidir.

Herhangi bir framework (React, Vue, Angular vs.) bağımlılığı olmadan doğrudan Vanilla JS veya Web Components ile kusursuz çalışır. İhtiyaç duyduğunuzda dilediğiniz framework içerisine kolayca entegre edilebilir.

---

## 🌟 Özellikler

- **Çekirdek Reactivity (Signals):** Değişkenleri takip edin, değer değiştiğinde sadece o değere bağlı olan fonksiyonlar (effect) yeniden çalışsın.
- **Türetilmiş Durumlar (Computed):** Diğer sinyallere bağlı, otomatik hesaplanan ve önbelleklenen (cached) akıllı değerler.
- **Performans & Bellek Dostu:** Gelişmiş "İki Yönlü Bağımlılık Takibi" (Two-Way Dependency Tracking) sayesinde kullanılmayan abonelikler otomatik temizlenir. Bellek sızıntısı (Memory Leak) yapmaz.
- **Eklenti Sistemi (Plugins):** NimbleJS çekirdeği çok küçüktür, ancak güçlü eklentilerle genişletilebilir:
  - 💾 **Persist Plugin:** State değişikliklerini otomatik olarak `localStorage`'a kaydeder ve geri yükler.
  - ⏪ **History Plugin:** Yapılan değişiklikleri takip ederek "Geri Al" (Undo) ve "Yinele" (Redo) özelliklerini uygulamanıza tek satırla ekler.
- **Tip Güvenliği:** Tamamen TypeScript ile yazılmıştır, kusursuz IDE desteği sunar.

---

## 🎯 Kimler İçin?

- **Vanilla JS Geliştiricileri:** Projesine React/Vue gibi büyük framework'ler eklemek istemeyen ancak modern bir "Reaktif State" yönetimine ihtiyaç duyanlar.
- **Mikro Front-End ve Web Components Geliştiricileri:** Component'ler arası hızlı ve hafif bir veri köprüsü kurmak isteyenler.
- **Performans Odaklı Projeler:** Gereksiz render'lardan kaçınarak sadece değişen veriyi DOM'a yansıtmak (Fine-grained reactivity) isteyen mühendisler.

---

## 🚀 Kurulum

NimbleJS'i projenize dahil etmek çok kolaydır:

```bash
# npm ile
npm install nimblejs

# yarn ile
yarn add nimblejs

# pnpm ile
pnpm add nimblejs
```

---

## 📖 Temel Kullanım

NimbleJS, state yönetimini mümkün olan en basit hale indirger.

### 1. Sinyaller (Signals) ve Yan Etkiler (Effects)

Bir `signal`, reaktif bir değer tutar. Bir `effect` ise sinyaldeki değişiklikleri dinler ve tepki verir.

```typescript
import { signal, effect } from 'nimblejs';

// 1. Reaktif bir değişken oluştur
const count = signal(0);

// 2. Bir yan etki (effect) tanımla. 
// Bu fonksiyon hemen çalışır ve içindeki sinyallere otomatik abone olur.
const unsubscribe = effect(() => {
  console.log(`Güncel sayaç değeri: ${count.value}`);
});
// Çıktı: "Güncel sayaç değeri: 0"

// 3. Değeri güncellediğinizde effect otomatik olarak tekrar tetiklenir
count.value = 1; 
// Çıktı: "Güncel sayaç değeri: 1"

// İşi bittiğinde effect'i durdurabilirsiniz (Memory leak engelleme)
unsubscribe();
```

### 2. Türetilmiş Değerler (Computed)

Başka sinyallerden beslenen, otomatik olarak güncellenen türetilmiş değerler oluşturabilirsiniz.

```typescript
import { signal, computed, effect } from 'nimblejs';

const price = signal(100);
const taxRate = signal(0.18);

// price veya taxRate değiştiğinde totalPrice otomatik güncellenir
const totalPrice = computed(() => price.value + (price.value * taxRate.value));

effect(() => {
  console.log(`Toplam Fiyat: ${totalPrice.value} TL`);
});
// Çıktı: "Toplam Fiyat: 118 TL"

price.value = 200;
// Çıktı: "Toplam Fiyat: 236 TL"
```

---

## 🛠️ Gelişmiş Kullanım (Store ve Eklentiler)

Büyük projelerde state'leri bir arada tutmak için `Store` yapısını kullanabilirsiniz. Store yapısı, NimbleJS'in harika eklentilerini (Undo/Redo, LocalStorage) kullanmanıza olanak tanır.

```typescript
import { createStore, effect, persist, withHistory } from 'nimblejs';

// 1. Merkezi bir Store oluştur
const appStore = createStore('myApp', {
  username: 'Guest',
  theme: 'light'
});

// 2. (Opsiyonel) Persist Eklentisi: State'i LocalStorage'a kaydet
persist(appStore);

// 3. (Opsiyonel) History Eklentisi: Geri al/Yinele özelliği ekle
const history = withHistory(appStore, { maxHistory: 20 });

// Değişiklikleri dinle
effect(() => {
  document.body.className = appStore.state.theme.value;
  document.getElementById('user').innerText = appStore.state.username.value;
});

// Değerleri güncelle (LocalStorage'a otomatik kaydolur ve History'ye eklenir)
appStore.state.theme.value = 'dark';
appStore.state.username.value = 'Onur';

// Hata mı yaptınız? Geri alın!
document.getElementById('undo-btn').addEventListener('click', () => {
  if (history.canUndo) {
    history.undo(); // Theme tekrar 'light', Username tekrar 'Guest' olur.
  }
});
```

---

## 🧠 Nasıl Çalışır? (Mimari Detaylar)

NimbleJS, arka planda **İki Yönlü Bağımlılık Takibi (Two-Way Dependency Tracking)** kullanır.
Eski usül reaktif kütüphanelerde bir `effect` bir sinyali dinlemeye başladığında, sonsuza dek o sinyale abone kalırdı (Memory Leak).

NimbleJS'te ise bir `effect` her çalıştığında, önce kendisini tüm eski aboneliklerinden temizler (cleanup), ardından sadece o anki çalışmasında okuduğu (read) sinyallere yeniden abone olur. Bu sayede `if/else` blokları arasında değişen bağımlılıklar kusursuz ve pürüzsüz bir şekilde yönetilir.

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaktır! Hata bildirimleri (issues), yeni özellik istekleri ve Pull Request'ler (PR) başımızın tacıdır.
Projeyi yerelinizde çalıştırmak için:

```bash
git clone https://github.com/your-username/nimblejs.git
cd nimblejs
npm install
npm run dev # Demo sayfasını başlatır
```

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Dilediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz.
