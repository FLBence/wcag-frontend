import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

/*
 * Az alkalmazás megjelenítési témájának kezelése.
 *
 * Felelős a sötét és világos téma közötti váltásért, a felhasználó választásának mentéséért, valamint
 * a rendszer alapértelmezett témabeállításának figyelembevételéért.
 *
 * A megvalósítás saját elképzelés alapján, mesterséges intelligencia közreműködésével készült.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal<boolean>(true);

  /*
   * A szolgáltatás inicializálása.
   *
   * Böngészőkörnyezetben betölti a korábban elmentett témabeállítást.
   * Ha nincs mentett beállítás, a rendszer által preferált témát alkalmazza.
   */
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) this.setDarkMode(true);
      else this.setDarkMode(false);
    }
  }

  /*
   * A megjelenítési téma váltása sötét és világos mód között.
   */
  toggleTheme(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  /*
   * A megadott megjelenítési téma beállítása.
   *
   * Frissíti a téma állapotát, módosítja a dokumentum gyökérelemének
   * CSS-osztályát, és elmenti a választott beállítást a localStorage-ba.
   */
  private setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
