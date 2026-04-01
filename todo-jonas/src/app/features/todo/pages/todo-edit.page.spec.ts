import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoEditPageComponent } from './todo-edit.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { vi } from 'vitest';

describe('TodoEditPageComponent', () => {
  let component: TodoEditPageComponent;
  let fixture: ComponentFixture<TodoEditPageComponent>;
  let mockTodoService: {
    byId: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    toggleActive: ReturnType<typeof vi.fn>;
    load: ReturnType<typeof vi.fn>;
  };
  let mockRouter: { navigateByUrl: ReturnType<typeof vi.fn> };
  let mockAuthService: { isAdmin: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: {
    snapshot: {
      paramMap: {
        get: ReturnType<typeof vi.fn>;
      };
    };
  };

  const mockTodo = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    closed: false,
    active: true,
  };

  beforeEach(async () => {
    mockTodoService = {
      byId: vi.fn().mockResolvedValue(mockTodo),
      update: vi.fn().mockResolvedValue(undefined),
      toggleActive: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue(undefined),
    };
    mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };
    mockAuthService = {
      isAdmin: vi.fn().mockReturnValue(true),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('test-1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [TodoEditPageComponent, TodoFormComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoEditPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load todo and set it', async () => {
      await component.ngOnInit();

      expect(mockTodoService.byId).toHaveBeenCalledWith('test-1', true);
      expect(component.todo()).toEqual(mockTodo);
    });

    it('should navigate to list if id not provided', async () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);

      await component.ngOnInit();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });

    it('should navigate to list if todo not found', async () => {
      mockTodoService.byId.mockResolvedValue(undefined);

      await component.ngOnInit();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should update todo and navigate on success', async () => {
      const formValue = {
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      };

      await component.save(formValue);

      expect(mockTodoService.update).toHaveBeenCalledWith('test-1', {
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      });
      expect(mockTodoService.toggleActive).toHaveBeenCalledWith('test-1', false);
      expect(mockTodoService.load).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });

    it('should not change active state if user is not admin', async () => {
      mockAuthService.isAdmin.mockReturnValue(false);

      const formValue = {
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      };

      await component.save(formValue);

      const callArgs = mockTodoService.update.mock.calls.at(-1)?.[1];
      expect(callArgs?.active).toBe(true);
      expect(mockTodoService.toggleActive).not.toHaveBeenCalled();
    });

    it('should show alert on error', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => undefined);
      mockTodoService.update.mockRejectedValue(new Error('API Error'));

      const formValue = {
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      };

      await component.save(formValue);

      expect(window.alert).toHaveBeenCalledWith('Failed to update todo. Please try again.');
    });

    it('should return early if no todo is loaded', async () => {
      component.todo.set(undefined);

      await component.save({
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      });

      expect(mockTodoService.update).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should navigate to todo list', () => {
      component.cancel();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });
  });
});
