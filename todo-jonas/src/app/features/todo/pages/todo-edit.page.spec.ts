import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoEditPageComponent } from './todo-edit.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { of } from 'rxjs';

describe('TodoEditPageComponent', () => {
  let component: TodoEditPageComponent;
  let fixture: ComponentFixture<TodoEditPageComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockActivatedRoute: any;

  const mockTodo = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    closed: false,
    active: true,
  };

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['byId', 'update', 'load']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAdmin: jasmine.createSpy('isAdmin').and.returnValue(true),
    });

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-1'),
        },
      },
    };

    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));
    mockTodoService.byId.and.returnValue(Promise.resolve(mockTodo));
    mockTodoService.update.and.returnValue(Promise.resolve());
    mockTodoService.load.and.returnValue(Promise.resolve());

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

      expect(mockTodoService.byId).toHaveBeenCalledWith('test-1');
      expect(component.todo()).toEqual(mockTodo);
    });

    it('should navigate to list if id not provided', async () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

      await component.ngOnInit();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });

    it('should navigate to list if todo not found', async () => {
      mockTodoService.byId.and.returnValue(Promise.resolve(undefined));

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
      expect(mockTodoService.load).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
    });

    it('should not change active state if user is not admin', async () => {
      (mockAuthService.isAdmin as any).and.returnValue(false);

      const formValue = {
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      };

      await component.save(formValue);

      const callArgs = mockTodoService.update.calls.mostRecent().args[1];
      expect(callArgs.active).toBe(true);
    });

    it('should show alert on error', async () => {
      spyOn(window, 'alert');
      mockTodoService.update.and.returnValue(Promise.reject(new Error('API Error')));

      const formValue = {
        name: 'Updated Todo',
        description: 'Updated description',
        closed: true,
        active: false,
      };

      await component.save(formValue);

      expect(window.alert).toHaveBeenCalledWith('Failed to update todo. Please try again.');
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
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

