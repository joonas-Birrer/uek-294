import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { TodoNewPageComponent } from './todo-new.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';

describe('TodoNewPageComponent', () => {
  let component: TodoNewPageComponent;
  let fixture: ComponentFixture<TodoNewPageComponent>;

  const mockTodoService = {
    create: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue(undefined),
  };

  const mockRouter = {
    navigateByUrl: vi.fn().mockResolvedValue(true),
  };

  const mockAuthService = {
    isAdmin: vi.fn().mockReturnValue(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoNewPageComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoNewPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('creates todo and navigates on success', async () => {
    await component.save({
      name: 'New Todo',
      description: 'This is a new todo',
      closed: false,
      active: false,
    });

    const callArg = mockTodoService.create.mock.calls.at(-1)?.[0];
    expect(callArg.name).toBe('New Todo');
    expect(callArg.description).toBe('This is a new todo');
    expect(callArg.id).toBeTruthy();
    expect(mockTodoService.load).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
  });

  it('shows alert on save error', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    mockTodoService.create.mockRejectedValueOnce(new Error('API Error'));

    await component.save({
      name: 'New Todo',
      description: 'This is a new todo',
      closed: false,
      active: true,
    });

    expect(alertSpy).toHaveBeenCalledWith('Failed to create todo. Please try again.');
    alertSpy.mockRestore();
  });

  it('generates UUID for new todo', async () => {
    await component.save({
      name: 'New Todo',
      description: 'This is a new todo',
      closed: false,
      active: true,
    });

    const callArg = mockTodoService.create.mock.calls.at(-1)?.[0];
    expect(callArg.id).toBeTruthy();
    expect(callArg.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('navigates to todo list on cancel', () => {
    component.cancel();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
  });
});
