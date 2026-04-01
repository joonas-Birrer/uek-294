import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TodoNewPageComponent } from './todo-new.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { of } from 'rxjs';

describe('TodoNewPageComponent', () => {
  let component: TodoNewPageComponent;
  let fixture: ComponentFixture<TodoNewPageComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['create', 'load']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAdmin: jasmine.createSpy('isAdmin').and.returnValue(false),
    });

    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));
    mockTodoService.create.and.returnValue(Promise.resolve());
    mockTodoService.load.and.returnValue(Promise.resolve());

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

      expect(mockTodoService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'New Todo',
          description: 'This is a new todo',
          active: true,
        }),
      );
      expect(mockTodoService.load).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });

    it('should show alert on error', async () => {
      spyOn(window, 'alert');
      mockTodoService.create.and.returnValue(Promise.reject(new Error('API Error')));

      const formValue = {
        name: 'New Todo',
        description: 'This is a new todo',
        closed: false,
        active: true,
      };

      await component.save(formValue);

      expect(window.alert).toHaveBeenCalledWith('Failed to create todo. Please try again.');
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should generate UUID for new todo', async () => {
      const formValue = {
        name: 'New Todo',
        description: 'This is a new todo',
        closed: false,
        active: true,
      };

      await component.save(formValue);

      const callArgs = mockTodoService.create.calls.mostRecent().args[0];
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

