import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { TodoApiItem, TodoCreateDto, TodoItem } from './todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const apiTodo: TodoApiItem = {
    guid: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    state: 'open',
    active: true,
  };

  const uiTodo: TodoItem = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
    closed: false,
    active: true,
  };

  const createDto: TodoCreateDto = {
    id: 'test-1',
    name: 'Test Todo',
    description: 'This is a test todo',
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

  it('creates service', () => {
    expect(service).toBeTruthy();
  });

  it('loads todos with showAll=false by default', async () => {
    const loadPromise = service.load();
    const req = httpMock.expectOne((r) => r.url === '/api/todo/data' && r.params.get('showAll') === 'false');
    expect(req.request.method).toBe('GET');
    req.flush([apiTodo]);

    await loadPromise;
    expect(service.items()).toEqual([uiTodo]);
  });

  it('loads todos with showAll=true for admin views', async () => {
    const loadPromise = service.load(true);
    const req = httpMock.expectOne((r) => r.url === '/api/todo/data' && r.params.get('showAll') === 'true');
    req.flush([apiTodo]);

    await loadPromise;
    expect(service.items().length).toBe(1);
  });

  it('creates todo with minimal API payload and default active=true', async () => {
    const createPromise = service.create(createDto);
    const optimistic = service.items().find((item) => item.id === createDto.id);
    expect(optimistic?.active).toBe(true);

    const req = httpMock.expectOne('/api/todo/data');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      guid: createDto.id,
      name: createDto.name,
      description: createDto.description,
    });
    req.flush(apiTodo);

    await createPromise;
    expect(service.items().some((item) => item.id === createDto.id)).toBe(true);
  });

  it('updates todo using PUT /api/todo/data/:id', async () => {
    service.items.set([uiTodo]);

    const updatePromise = service.update('test-1', {
      name: 'Updated Todo',
      description: uiTodo.description,
      closed: true,
      active: true,
    });

    const req = httpMock.expectOne('/api/todo/data/test-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      guid: 'test-1',
      name: 'Updated Todo',
      description: uiTodo.description,
      state: 'closed',
    });
    req.flush({ ...apiTodo, name: 'Updated Todo', state: 'closed' });

    await updatePromise;
    expect(service.items()[0].closed).toBe(true);
  });

  it('toggles active via admin patch endpoint', async () => {
    service.items.set([uiTodo]);

    const togglePromise = service.toggleActive('test-1', false);
    const req = httpMock.expectOne('/api/todo/admin/test-1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ active: false });
    req.flush({ ...apiTodo, active: false });

    await togglePromise;
    expect(service.items()[0].active).toBe(false);
  });

  it('deletes todo via admin endpoint', async () => {
    service.items.set([uiTodo]);

    const removePromise = service.remove('test-1');
    const req = httpMock.expectOne('/api/todo/admin/test-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    await removePromise;
    expect(service.items()).toEqual([]);
  });
});
