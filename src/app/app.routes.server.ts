import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: ':id/results',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users/:id/myscans',
    renderMode: RenderMode.Client,
  },
];
