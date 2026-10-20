import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    isDarkMode = signal<boolean>(true);
    
    constructor() {
        if(isPlatformBrowser(this.platformId)){
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if(savedTheme === 'dark' || (!savedTheme && systemPrefersDark))
                this.setDarkMode(true);
            else
                this.setDarkMode(false);
        }
    }

    toggleTheme(): void {
        this.setDarkMode(!this.isDarkMode());
    }

    private setDarkMode(isDark: boolean): void{
        this.isDarkMode.set(isDark);
        if(isPlatformBrowser(this.platformId)){
            if(isDark){
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            else{
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }
}