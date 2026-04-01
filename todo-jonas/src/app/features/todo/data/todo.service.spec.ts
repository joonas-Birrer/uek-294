import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { TodoItem, TodoCreateDto } from './todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodo: TodoItem = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    closed: false,
    active: true,
  };
  };

  const mockTodoCreateDto: TodoCreateDto = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    active: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('should load todos from API', async () => {
      const mockTodos = [mockTodo];

      const loadPromise = service.load();
      const req = httpMock.expectOne('/api/todo/data');
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos);

      await loadPromise;
      expect(service.items()).toEqual(mockTodos);
    });

    it('should handle load errors gracefully', async () => {
      const initialItems = service.items();

      const loadPromise = service.load();
      const req = httpMock.expectOne('/api/todo/data');
      req.error(new ErrorEvent('Network error'));

      await loadPromise;
      expect(service.items()).toEqual(initialItems);
    });

    it('should set loading to false after load completes', async () => {
      expect(service.loading()).toBe(false);

      const loadPromise = service.load();
      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne('/api/todo/data');
      req.flush([]);

      await loadPromise;
      expect(service.loading()).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a todo optimistically and update with server response', async () => {
      const initialCount = service.items().length;

      const createPromise = service.create(mockTodoCreateDto);

      expect(service.items().length).toBe(initialCount + 1);
      expect(service.items().some((item) => item.id === 'test-1')).toBe(true);

      const req = httpMock.expectOne('/api/todo/data');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockTodoCreateDto);
      req.flush(mockTodo);

      await createPromise;
      expect(service.items().some((item) => item.id === 'test-1')).toBe(true);
    });

    it('should remove optimistically added item on error', async () => {
      const initialCount = service.items().length;

      const createPromise = service.create(mockTodoCreateDto);
      expect(service.items().length).toBe(initialCount + 1);

      const req = httpMock.expectOne('/api/todo/data');
      req.error(new ErrorEvent('Network error'));

      try {
        await createPromise;
        fail('should have thrown error');
      } catch {
        expect(service.items().length).toBe(initialCount);
        expect(service.items().some((item) => item.id === 'test-1')).toBe(false);
      }
    });
  });

  describe('update', () => {
    beforeEach(() => {
      service.items.set([mockTodo]);
    });

    it('should update a todo and sync with server response', async () => {
      const updatedTodo = { ...mockTodo, name: 'Updated Todo' };

      const updatePromise = service.update('test-1', {
        name: 'Updated Todo',
        description: mockTodo.description,
        closed: mockTodo.closed,
        active: mockTodo.active,
      });

      expect(service.items()[0].name).toBe('Updated Todo');

      const req = httpMock.expectOne('/api/todo/admin/test-1');
      expect(req.request.method).toBe('PATCH');
      req.flush(updatedTodo);

      await updatePromise;
      expect(service.items()[0]).toEqual(updatedTodo);
    });

    it('should restore original item on error', async () => {
      const updatePromise = service.update('test-1', {
        name: 'Updated Todo',
        description: mockTodo.description,
        closed: mockTodo.closed,
        active: mockTodo.active,
      });

      const req = httpMock.expectOne('/api/todo/admin/test-1');
      req.error(new ErrorEvent('Network error'));

      try {
        await updatePromise;
        fail('should have thrown error');
      } catch {
        expect(service.items()[0]).toEqual(mockTodo);
      }
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      service.items.set([mockTodo]);
    });

    it('should remove a todo and delete via API', async () => {
      const removePromise = service.remove('test-1');
      expect(service.items().length).toBe(0);

      const req = httpMock.expectOne('/api/todo/admin/test-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      await removePromise;
      expect(service.items().length).toBe(0);
    });

    it('should restore items on deletion error', async () => {
      const removePromise = service.remove('test-1');
      expect(service.items().length).toBe(0);

      const req = httpMock.expectOne('/api/todo/admin/test-1');
      req.error(new ErrorEvent('Network error'));

      try {
        await removePromise;
        fail('should have thrown error');
      } catch {
        expect(service.items().length).toBe(1);
        expect(service.items()[0]).toEqual(mockTodo);
      }
    });
  });

  describe('byId', () => {
    beforeEach(() => {
      service.items.set([mockTodo]);
    });

    it('should return todo from local items if found', async () => {
      const result = await service.byId('test-1');
      httpMock.expectNone('/api/todo/data/test-1');
      expect(result).toEqual(mockTodo);
    });

    it('should fetch todo from API if not in local items', async () => {
      const result = service.byId('unknown-id');

      const req = httpMock.expectOne('/api/todo/data/unknown-id');
      expect(req.request.method).toBe('GET');
      req.flush(mockTodo);

      expect(await result).toEqual(mockTodo);
    });

    it('should return undefined if todo not found', async () => {
      const result = service.byId('unknown-id');

      const req = httpMock.expectOne('/api/todo/data/unknown-id');
      req.error(new ErrorEvent('Not found'));

      expect(await result).toBeUndefined();
    });
  });

  describe('toggleClosed', () => {
    beforeEach(() => {
      service.items.set([mockTodo]);
    });

    it('should toggle closed state', async () => {
      const togglePromise = service.toggleClosed('test-1', true);

      const req = httpMock.expectOne('/api/todo/admin/test-1');
      expect(req.request.body.closed).toBe(true);
      req.flush({ ...mockTodo, closed: true });

      await togglePromise;
    });
  });

  describe('toggleActive', () => {
    beforeEach(() => {
      service.items.set([mockTodo]);
    });

    it('should toggle active state', async () => {
      const togglePromise = service.toggleActive('test-1', false);

      const req = httpMock.expectOne('/api/todo/admin/test-1');
      expect(req.request.body.active).toBe(false);
      req.flush({ ...mockTodo, active: false });

      await togglePromise;
    });
  });
});

