import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoListPageComponent } from './todo-list.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoHeaderComponent } from '../components/todo-header/todo-header.component';
import { TodoRowComponent } from '../components/todo-row/todo-row.component';
import { of } from 'rxjs';

describe('TodoListPageComponent', () => {
  let component: TodoListPageComponent;
  let fixture: ComponentFixture<TodoListPageComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

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
    mockTodoService = jasmine.createSpyObj('TodoService', [
      'load',
      'toggleClosed',
      'remove',
      'items',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAdmin: jasmine.createSpy('isAdmin').and.returnValue(true),
    });
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    mockTodoService.load.and.returnValue(Promise.resolve());
    mockTodoService.toggleClosed.and.returnValue(Promise.resolve());
    mockTodoService.remove.and.returnValue(Promise.resolve());
    mockTodoService.items.and.returnValue(mockTodos);
    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));

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

      expect(mockTodoService.load).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should reload todos', async () => {
      await component.refresh();

      expect(mockTodoService.load).toHaveBeenCalled();
    });
  });

  describe('toggleClosed', () => {
    it('should toggle closed state', async () => {
      await component.toggleClosed({ id: 'test-1', checked: true });

      expect(mockTodoService.toggleClosed).toHaveBeenCalledWith('test-1', true);
    });

    it('should show alert on error', async () => {
      spyOn(window, 'alert');
      mockTodoService.toggleClosed.and.returnValue(Promise.reject(new Error('API Error')));

      await component.toggleClosed({ id: 'test-1', checked: true });

      expect(window.alert).toHaveBeenCalledWith('Failed to update todo. Please try again.');
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      mockTodoService.items = jasmine.createSpy('items').and.returnValue(mockTodos);
    });

    it('should show confirmation dialog and delete if confirmed', async () => {
      const mockDialogRef = {
        afterClosed: () => of(true),
      } as any;

      mockDialog.open.and.returnValue(mockDialogRef);
      mockTodoService.load.and.returnValue(Promise.resolve());

      await component.remove('test-1');

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockTodoService.remove).toHaveBeenCalledWith('test-1');
      expect(mockTodoService.load).toHaveBeenCalled();
    });

    it('should not delete if user cancels', async () => {
      const mockDialogRef = {
        afterClosed: () => of(false),
      } as any;

      mockDialog.open.and.returnValue(mockDialogRef);

      await component.remove('test-1');

      expect(mockTodoService.remove).not.toHaveBeenCalled();
    });

    it('should return early if not admin', async () => {
      (mockAuthService.isAdmin as any).and.returnValue(false);

      await component.remove('test-1');

      expect(mockDialog.open).not.toHaveBeenCalled();
      expect(mockTodoService.remove).not.toHaveBeenCalled();
    });

    it('should show alert on deletion error', async () => {
      spyOn(window, 'alert');
      const mockDialogRef = {
        afterClosed: () => of(true),
      } as any;

      mockDialog.open.and.returnValue(mockDialogRef);
      mockTodoService.remove.and.returnValue(Promise.reject(new Error('API Error')));

      await component.remove('test-1');

      expect(window.alert).toHaveBeenCalledWith('Failed to delete todo. Please try again.');
    });

    it('should return early if todo not found', async () => {
      mockTodoService.items = jasmine.createSpy('items').and.returnValue([]);

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
      (mockAuthService.isAdmin as any).and.returnValue(true);
      fixture.detectChanges();

      expect(mockTodoService.items).toHaveBeenCalled();
    });

    it('should filter todos if user is not admin', () => {
      (mockAuthService.isAdmin as any).and.returnValue(false);
      fixture.detectChanges();

      expect(mockTodoService.items).toHaveBeenCalled();
    });
  });
});

