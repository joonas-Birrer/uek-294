import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';
import { TodoEditPageComponent } from './todo-edit.page';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';

describe('TodoEditPageComponent', () => {
  let component: TodoEditPageComponent;
  let fixture: ComponentFixture<TodoEditPageComponent>;

  const mockTodo = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    closed: false,
    active: true,
  };

  const mockTodoService = {
    byId: vi.fn().mockResolvedValue(mockTodo),
    update: vi.fn().mockResolvedValue(undefined),
    toggleActive: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue(undefined),
  };

  const mockRouter = {
    navigateByUrl: vi.fn().mockResolvedValue(true),
  };

  const isAdminSpy = vi.fn().mockReturnValue(true);
  const mockAuthService = {
    isAdmin: isAdminSpy,
  };

  const paramGetSpy = vi.fn().mockReturnValue('test-1');
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: paramGetSpy,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoEditPageComponent],
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

  afterEach(() => {
    vi.clearAllMocks();
    isAdminSpy.mockReturnValue(true);
    paramGetSpy.mockReturnValue('test-1');
    mockTodoService.byId.mockResolvedValue(mockTodo);
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('loads todo on init', async () => {
    await component.ngOnInit();
    expect(mockTodoService.byId).toHaveBeenCalledWith('test-1', true);
    expect(component.todo()).toEqual(mockTodo);
  });

  it('navigates to list when id is missing', async () => {
    paramGetSpy.mockReturnValue(null);
    await component.ngOnInit();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
  });

  it('navigates to list when todo is not found', async () => {
    mockTodoService.byId.mockResolvedValueOnce(undefined);
    await component.ngOnInit();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
  });

  it('updates and toggles active for admin when changed', async () => {
    await component.ngOnInit();

    await component.save({
      name: 'Updated Todo',
      description: 'Updated description',
      closed: true,
      active: false,
    });

    expect(mockTodoService.update).toHaveBeenCalledWith('test-1', {
      name: 'Updated Todo',
      description: 'Updated description',
      closed: true,
      active: false,
    });
    expect(mockTodoService.toggleActive).toHaveBeenCalledWith('test-1', false);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
  });

  it('does not toggle active for non-admin', async () => {
    isAdminSpy.mockReturnValue(false);
    await component.ngOnInit();

    await component.save({
      name: 'Updated Todo',
      description: 'Updated description',
      closed: true,
      active: false,
    });

    expect(mockTodoService.update).toHaveBeenCalledWith('test-1', {
      name: 'Updated Todo',
      description: 'Updated description',
      closed: true,
      active: true,
    });
    expect(mockTodoService.toggleActive).not.toHaveBeenCalled();
  });

  it('shows alert on save error', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    await component.ngOnInit();
    mockTodoService.update.mockRejectedValueOnce(new Error('API Error'));

    await component.save({
      name: 'Updated Todo',
      description: 'Updated description',
      closed: true,
      active: false,
    });

    expect(alertSpy).toHaveBeenCalledWith('Failed to update todo. Please try again.');
    alertSpy.mockRestore();
  });

  it('returns early if no todo is loaded', async () => {
    component.todo.set(undefined);

    await component.save({
      name: 'Updated Todo',
      description: 'Updated description',
      closed: true,
      active: false,
    });

    expect(mockTodoService.update).not.toHaveBeenCalled();
  });

  it('navigates to todo list on cancel', () => {
    component.cancel();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo/list');
  });
});
