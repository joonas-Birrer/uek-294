import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TodoListPageComponent } from './todo-list.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoHeaderComponent } from '../components/todo-header/todo-header.component';
import { TodoRowComponent } from '../components/todo-row/todo-row.component';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('TodoListPageComponent', () => {
  let component: TodoListPageComponent;
  let fixture: ComponentFixture<TodoListPageComponent>;
  let mockTodoService: {
    load: ReturnType<typeof vi.fn>;
    toggleClosed: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    items: ReturnType<typeof vi.fn>;
    loading: ReturnType<typeof vi.fn>;
  };
  let mockRouter: { navigateByUrl: ReturnType<typeof vi.fn> };
  let mockAuthService: { isAdmin: ReturnType<typeof vi.fn> };
  let mockDialog: { open: ReturnType<typeof vi.fn> };

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
    {
      id: 'test-3',
      name: 'Closed Todo',
      description: 'This is a closed todo',
      closed: true,
      active: true,
    },
  ];

  beforeEach(async () => {
    mockTodoService = {
      load: vi.fn().mockResolvedValue(undefined),
      toggleClosed: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
      items: vi.fn().mockReturnValue(mockTodos),
      loading: vi.fn().mockReturnValue(false),
    };
    mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };
    mockAuthService = {
      isAdmin: vi.fn().mockReturnValue(true),
    };
    mockDialog = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        TodoListPageComponent,
        TodoHeaderComponent,
        TodoRowComponent,
      ],
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load todos on init', async () => {
      await component.ngOnInit();

      expect(mockTodoService.load).toHaveBeenCalledWith(true);
    });
  });

  describe('refresh', () => {
    it('should reload todos', async () => {
      await component.refresh();

      expect(mockTodoService.load).toHaveBeenCalledWith(true);
    });
  });

  describe('toggleClosed', () => {
    it('should toggle closed state', async () => {
      await component.toggleClosed({ id: 'test-1', checked: true });

      expect(mockTodoService.toggleClosed).toHaveBeenCalledWith('test-1', true);
    });

    it('should show alert on error', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => undefined);
      mockTodoService.toggleClosed.mockRejectedValue(new Error('API Error'));

      await component.toggleClosed({ id: 'test-1', checked: true });

      expect(window.alert).toHaveBeenCalledWith('Failed to update todo. Please try again.');
    });
  });

  describe('remove', () => {
    it('should show confirmation dialog and delete if confirmed', async () => {
      const mockDialogRef = {
        afterClosed: () => of(true),
      } as any;

      mockDialog.open.mockReturnValue(mockDialogRef);
      mockTodoService.load.mockResolvedValue(undefined);

      await component.remove('test-1');

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockTodoService.remove).toHaveBeenCalledWith('test-1');
      expect(mockTodoService.load).toHaveBeenCalled();
    });

    it('should not delete if user cancels', async () => {
      const mockDialogRef = {
        afterClosed: () => of(false),
      } as any;

      mockDialog.open.mockReturnValue(mockDialogRef);

      await component.remove('test-1');

      expect(mockTodoService.remove).not.toHaveBeenCalled();
    });

    it('should return early if not admin', async () => {
      mockAuthService.isAdmin.mockReturnValue(false);

      await component.remove('test-1');

      expect(mockDialog.open).not.toHaveBeenCalled();
      expect(mockTodoService.remove).not.toHaveBeenCalled();
    });

    it('should show alert on deletion error', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => undefined);
      const mockDialogRef = {
        afterClosed: () => of(true),
      } as any;

      mockDialog.open.mockReturnValue(mockDialogRef);
      mockTodoService.remove.mockRejectedValue(new Error('API Error'));

      await component.remove('test-1');

      expect(window.alert).toHaveBeenCalledWith('Failed to delete todo. Please try again.');
    });

    it('should return early if todo not found', async () => {
      mockTodoService.items.mockReturnValue([]);

      await component.remove('unknown-id');

      expect(mockDialog.open).not.toHaveBeenCalled();
    });
  });

  describe('createNew', () => {
    it('should navigate to new todo page', () => {
      component.createNew();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/new');
    });
  });

  describe('todos computed', () => {
    it('should return all todos if user is admin', () => {
      mockAuthService.isAdmin.mockReturnValue(true);

      expect((component as any).todos()).toEqual(mockTodos);
    });

    it('should filter todos if user is not admin', () => {
      mockAuthService.isAdmin.mockReturnValue(false);

      expect((component as any).todos()).toEqual(mockTodos.filter((todo) => todo.active));
    });
  });
});

