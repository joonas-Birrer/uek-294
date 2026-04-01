import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { TodoListPageComponent } from './todo-list.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';

describe('TodoListPageComponent', () => {
  let component: TodoListPageComponent;
  let fixture: ComponentFixture<TodoListPageComponent>;

  const mockTodos = [
    {
      id: 'test-1',
      name: 'Active Todo',
      description: 'This is an active todo',
      closed: false,
      active: true,
    },
    {
      id: 'test-2',
      name: 'Inactive Todo',
      description: 'This is an inactive todo',
      closed: false,
      active: false,
    },
  ];

  const mockTodoService = {
    load: vi.fn().mockResolvedValue(undefined),
    toggleClosed: vi.fn().mockResolvedValue(undefined),
    toggleActive: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    items: vi.fn().mockReturnValue(mockTodos),
    loading: vi.fn().mockReturnValue(false),
  };

  const mockRouter = {
    navigateByUrl: vi.fn().mockResolvedValue(true),
  };

  const isAdminSpy = vi.fn().mockReturnValue(true);
  const mockAuthService = {
    isAdmin: isAdminSpy,
  };

  const mockDialog = {
    open: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListPageComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
    isAdminSpy.mockReturnValue(true);
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('loads todos on init using admin flag', async () => {
    await component.ngOnInit();
    expect(mockTodoService.load).toHaveBeenCalledWith(true);
  });

  it('refreshes todos using admin flag', async () => {
    await component.refresh();
    expect(mockTodoService.load).toHaveBeenCalledWith(true);
  });

  it('toggles closed state', async () => {
    await component.toggleClosed({ id: 'test-1', checked: true });
    expect(mockTodoService.toggleClosed).toHaveBeenCalledWith('test-1', true);
  });

  it('toggles active state for admin and refreshes', async () => {
    await component.toggleActive({ id: 'test-1', checked: false });
    expect(mockTodoService.toggleActive).toHaveBeenCalledWith('test-1', false);
    expect(mockTodoService.load).toHaveBeenCalledWith(true);
  });

  it('does not toggle active state for non-admin', async () => {
    isAdminSpy.mockReturnValue(false);
    await component.toggleActive({ id: 'test-1', checked: false });
    expect(mockTodoService.toggleActive).not.toHaveBeenCalled();
  });

  it('deletes after dialog confirmation', async () => {
    mockDialog.open.mockReturnValue({ afterClosed: () => of(true) });
    await component.remove('test-1');
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockTodoService.remove).toHaveBeenCalledWith('test-1');
  });

  it('navigates to new todo page', () => {
    component.createNew();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/new');
  });
});
