import { RenderMode, ServerRoute } from '@angular/ssr';

/*
 * A szerveroldali renderelés útvonalankénti konfigurációja.
 *
 * Meghatározza, hogy az egyes útvonalak kliensoldali rendereléssel vagy előzetes rendereléssel jelenjenek meg.
 *
 * Felhasznált forrás: https://angular.dev/api/ssr/RenderMode
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: ':id/results',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users/:id/myscans',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
