import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TodoNewPageComponent } from './todo-new.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { vi } from 'vitest';

describe('TodoNewPageComponent', () => {
  let component: TodoNewPageComponent;
  let fixture: ComponentFixture<TodoNewPageComponent>;
  let mockTodoService: {
    create: ReturnType<typeof vi.fn>;
    load: ReturnType<typeof vi.fn>;
  };
  let mockRouter: { navigateByUrl: ReturnType<typeof vi.fn> };
  let mockAuthService: { isAdmin: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockTodoService = {
      create: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue(undefined),
    };
    mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };
    mockAuthService = {
      isAdmin: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [TodoNewPageComponent, TodoFormComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save', () => {
    it('should create todo and navigate on success', async () => {
      const formValue = {
        name: 'New Todo',
        description: 'This is a new todo',
        closed: false,
        active: true,
      };

      await component.save(formValue);

      const callArgs = mockTodoService.create.mock.calls.at(-1)?.[0];
      expect(callArgs?.name).toBe('New Todo');
      expect(callArgs?.description).toBe('This is a new todo');
      expect(callArgs?.active).toBe(true);
      expect(mockTodoService.load).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });

    it('should show alert on error', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => undefined);
      mockTodoService.create.mockRejectedValue(new Error('API Error'));

      const formValue = {
        name: 'New Todo',
        description: 'This is a new todo',
        closed: false,
        active: true,
      };

      await component.save(formValue);

      expect(window.alert).toHaveBeenCalledWith('Failed to create todo. Please try again.');
    });

    it('should generate UUID for new todo', async () => {
      const formValue = {
        name: 'New Todo',
        description: 'This is a new todo',
        closed: false,
        active: true,
      };

      await component.save(formValue);

      const callArgs = mockTodoService.create.mock.calls.at(-1)?.[0];
      expect(callArgs.id).toBeTruthy();
      expect(callArgs.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });

  describe('cancel', () => {
    it('should navigate to todo list', () => {
      component.cancel();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });
  });
});
