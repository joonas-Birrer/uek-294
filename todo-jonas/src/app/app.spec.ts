import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render toolbar with home link', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain('Home');
  });

  it('should open swagger docs from shortcut', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    (app as any).openSwaggerDocs();

    expect(openSpy).toHaveBeenCalledWith('/api/docs', '_blank', 'noopener,noreferrer');
  });

  it('should open keycloak admin from shortcut', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    (app as any).openKeycloakAdmin();

    expect(openSpy).toHaveBeenCalledWith('/auth/admin', '_blank', 'noopener,noreferrer');
  });
});
