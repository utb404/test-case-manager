// Данные приложения
let appData = {
  "folders": {
    "root": {
      "id": "root",
      "name": "Root",
      "type": "folder",
      "children": ["auth-tests", "api-tests", "ui-tests"]
    },
    "auth-tests": {
      "id": "auth-tests", 
      "name": "Тесты авторизации",
      "type": "folder",
      "parent": "root",
      "children": ["test-001", "test-002"]
    },
    "api-tests": {
      "id": "api-tests",
      "name": "API тесты", 
      "type": "folder",
      "parent": "root",
      "children": ["test-003"]
    },
    "ui-tests": {
      "id": "ui-tests",
      "name": "UI тесты",
      "type": "folder", 
      "parent": "root",
      "children": []
    }
  },
  "testCases": {
    "test-001": {
      "id": "test-001",
      "name": "Успешная авторизация с валидными данными",
      "author": "Иван Иванов",
      "assignee": "Петр Петров", 
      "status": "active",
      "tags": ["auth", "positive", "smoke"],
      "preconditions": "Пользователь зарегистрирован в системе",
      "steps": [
        {
          "id": "step-1",
          "action": "Открыть страницу авторизации",
          "expectedResult": "Отображается форма входа с полями логин и пароль",
          "status": "not_run",
          "bugUrl": ""
        },
        {
          "id": "step-2", 
          "action": "Ввести валидный логин и пароль",
          "expectedResult": "Данные вводятся корректно",
          "status": "not_run",
          "bugUrl": ""
        },
        {
          "id": "step-3",
          "action": "Нажать кнопку 'Войти'",
          "expectedResult": "Пользователь успешно авторизован и перенаправлен в личный кабинет",
          "status": "not_run", 
          "bugUrl": ""
        }
      ],
      "executionStatus": "not_run",
      "parent": "auth-tests"
    },
    "test-002": {
      "id": "test-002",
      "name": "Авторизация с неверным паролем",
      "author": "Мария Сидорова",
      "assignee": "Иван Иванов",
      "status": "active", 
      "tags": ["auth", "negative"],
      "preconditions": "Пользователь зарегистрирован в системе",
      "steps": [
        {
          "id": "step-1",
          "action": "Открыть страницу авторизации", 
          "expectedResult": "Отображается форма входа",
          "status": "not_run",
          "bugUrl": ""
        },
        {
          "id": "step-2",
          "action": "Ввести валидный логин и неверный пароль",
          "expectedResult": "Данные вводятся", 
          "status": "not_run",
          "bugUrl": ""
        },
        {
          "id": "step-3",
          "action": "Нажать кнопку 'Войти'",
          "expectedResult": "Отображается ошибка 'Неверный логин или пароль'",
          "status": "not_run",
          "bugUrl": ""
        }
      ],
      "executionStatus": "not_run",
      "parent": "auth-tests"
    },
    "test-003": {
      "id": "test-003", 
      "name": "Получение списка пользователей через API",
      "author": "Алексей Смирнов",
      "assignee": "Мария Сидорова",
      "status": "active",
      "tags": ["api", "users", "get"],
      "preconditions": "API сервер запущен, есть авторизационный токен",
      "steps": [
        {
          "id": "step-1",
          "action": "Отправить GET запрос на /api/users с валидным токеном",
          "expectedResult": "Запрос отправлен успешно",
          "status": "not_run", 
          "bugUrl": ""
        },
        {
          "id": "step-2",
          "action": "Проверить статус ответа",
          "expectedResult": "Статус ответа 200 OK",
          "status": "not_run",
          "bugUrl": ""
        },
        {
          "id": "step-3",
          "action": "Проверить структуру ответа",
          "expectedResult": "Ответ содержит массив пользователей с полями id, name, email",
          "status": "not_run",
          "bugUrl": ""
        }
      ],
      "executionStatus": "not_run",
      "parent": "api-tests"
    }
  },
  "executions": [],
  "nextId": 4
};

// Глобальные переменные
let selectedTestCase = null;
let selectedNode = null;
let draggedElement = null;
let currentContextMenu = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderNavigatorTree();
    setupEventListeners();
    setupDragAndDrop();
    hideContextMenu();
}

// Отрисовка дерева навигатора
function renderNavigatorTree() {
    const treeContainer = document.getElementById('navigatorTree');
    treeContainer.innerHTML = '';
    renderTreeNode('root', treeContainer);
}

function renderTreeNode(nodeId, container, level = 0) {
    const isFolder = appData.folders[nodeId];
    const isTestCase = appData.testCases[nodeId];
    
    if (!isFolder && !isTestCase) return;

    const nodeData = isFolder ? appData.folders[nodeId] : appData.testCases[nodeId];
    const hasChildren = isFolder && nodeData.children && nodeData.children.length > 0;
    
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-item';
    nodeElement.style.marginLeft = `${level * 16}px`;
    
    nodeElement.innerHTML = `
        <div class="tree-node" data-id="${nodeId}" data-type="${isFolder ? 'folder' : 'testcase'}" draggable="true">
            <span class="tree-toggle">${hasChildren ? '▼' : ''}</span>
            <span class="tree-icon">${isFolder ? '📁' : '📝'}</span>
            <span class="tree-label">${nodeData.name}</span>
            <div class="tree-actions">
                ${isFolder ? '<button class="tree-action" data-action="add-test">📝</button>' : ''}
                ${isFolder ? '<button class="tree-action" data-action="add-folder">📁</button>' : ''}
            </div>
        </div>
    `;
    
    container.appendChild(nodeElement);
    
    // Отрисовка детей для папок
    if (hasChildren) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        
        nodeData.children.forEach(childId => {
            renderTreeNode(childId, childrenContainer, level + 1);
        });
        
        container.appendChild(childrenContainer);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигатор
    document.getElementById('navigatorTree').addEventListener('click', handleTreeClick);
    document.getElementById('navigatorTree').addEventListener('contextmenu', handleTreeContextMenu);
    
    // Кнопки в панели инструментов
    document.getElementById('createFolderBtn').addEventListener('click', () => createFolder('root'));
    document.getElementById('runAllBtn').addEventListener('click', runAllTests);
    document.getElementById('resetStatusBtn').addEventListener('click', resetAllStatuses);
    document.getElementById('exportBtn').addEventListener('click', exportResults);
    
    // Поиск
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Вкладки
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Форма тест-кейса
    document.getElementById('testCaseForm').addEventListener('submit', saveTestCase);
    document.getElementById('addStepBtn').addEventListener('click', addStep);
    document.getElementById('cloneTestBtn').addEventListener('click', cloneTestCase);
    document.getElementById('deleteTestBtn').addEventListener('click', deleteTestCase);
    
    // Теги
    document.getElementById('newTag').addEventListener('keypress', handleTagInput);
    
    // Выполнение тестов
    document.getElementById('finishExecutionBtn').addEventListener('click', finishExecution);
    
    // Модальные окна
    setupModalListeners();
    
    // Закрытие контекстного меню
    document.addEventListener('click', hideContextMenu);
    document.addEventListener('contextmenu', hideContextMenu);
}

// Обработка клика по дереву
function handleTreeClick(e) {
    e.preventDefault();
    const treeNode = e.target.closest('.tree-node');
    if (!treeNode) return;
    
    const nodeId = treeNode.dataset.id;
    const nodeType = treeNode.dataset.type;
    const action = e.target.dataset.action;
    
    // Обработка действий
    if (action === 'add-test') {
        createTestCase(nodeId);
        return;
    } else if (action === 'add-folder') {
        createFolder(nodeId);
        return;
    }
    
    // Обработка переключения папок
    if (e.target.classList.contains('tree-toggle')) {
        toggleFolder(treeNode);
        return;
    }
    
    // Выбор узла
    selectNode(treeNode, nodeId, nodeType);
}

// Выбор узла в дереве
function selectNode(treeNode, nodeId, nodeType) {
    // Убираем выделение с предыдущего узла
    document.querySelectorAll('.tree-node.selected').forEach(node => {
        node.classList.remove('selected');
    });
    
    // Выделяем новый узел
    treeNode.classList.add('selected');
    selectedNode = { id: nodeId, type: nodeType };
    
    if (nodeType === 'testcase') {
        loadTestCase(nodeId);
        showTestCaseDetails();
    } else {
        hideTestCaseDetails();
    }
}

// Переключение сворачивания папок
function toggleFolder(treeNode) {
    const children = treeNode.parentElement.nextElementSibling;
    if (children && children.classList.contains('tree-children')) {
        children.classList.toggle('collapsed');
        const toggle = treeNode.querySelector('.tree-toggle');
        toggle.textContent = children.classList.contains('collapsed') ? '▶' : '▼';
    }
}

// Загрузка тест-кейса для редактирования
function loadTestCase(testCaseId) {
    const testCase = appData.testCases[testCaseId];
    if (!testCase) return;
    
    selectedTestCase = testCase;
    
    // Заполнение формы
    document.getElementById('testName').value = testCase.name;
    document.getElementById('testAuthor').value = testCase.author || '';
    document.getElementById('testAssignee').value = testCase.assignee || '';
    document.getElementById('testStatus').value = testCase.status;
    document.getElementById('testPreconditions').value = testCase.preconditions || '';
    
    // Теги
    renderTags(testCase.tags || []);
    
    // Шаги
    renderSteps(testCase.steps || []);
    
    // Вкладка выполнения
    renderExecutionSteps();
    
    // Общий статус
    updateOverallStatus();
}

// Отображение/скрытие деталей тест-кейса
function showTestCaseDetails() {
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('testCaseDetails').classList.remove('hidden');
}

function hideTestCaseDetails() {
    document.getElementById('welcomeMessage').classList.remove('hidden');
    document.getElementById('testCaseDetails').classList.add('hidden');
}

// Переключение вкладок
function switchTab(tabName) {
    // Убираем активность со всех кнопок и содержимого
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    
    // Активируем нужную вкладку
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
}

// Отрисовка тегов
function renderTags(tags) {
    const tagsList = document.getElementById('tagsList');
    tagsList.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <span class="tag-remove" data-tag="${tag}">×</span>
        `;
        tagsList.appendChild(tagElement);
    });
    
    // Обработчики удаления тегов
    tagsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
            removeTag(e.target.dataset.tag);
        }
    });
}

// Обработка ввода тегов
function handleTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tagInput = e.target;
        const tagValue = tagInput.value.trim();
        
        if (tagValue && selectedTestCase) {
            if (!selectedTestCase.tags) selectedTestCase.tags = [];
            if (!selectedTestCase.tags.includes(tagValue)) {
                selectedTestCase.tags.push(tagValue);
                renderTags(selectedTestCase.tags);
                tagInput.value = '';
            }
        }
    }
}

// Удаление тега
function removeTag(tag) {
    if (selectedTestCase && selectedTestCase.tags) {
        selectedTestCase.tags = selectedTestCase.tags.filter(t => t !== tag);
        renderTags(selectedTestCase.tags);
    }
}

// Отрисовка шагов
function renderSteps(steps) {
    const stepsList = document.getElementById('stepsList');
    stepsList.innerHTML = '';
    
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'step-item';
        stepElement.dataset.stepId = step.id;
        stepElement.draggable = true;
        
        stepElement.innerHTML = `
            <div class="step-header">
                <span class="step-drag-handle">⋮⋮</span>
                <span class="step-number">Шаг ${index + 1}</span>
                <div class="step-actions">
                    <button type="button" class="btn btn--sm btn--outline" onclick="removeStep('${step.id}')">🗑</button>
                </div>
            </div>
            <div class="step-content">
                <div class="step-field">
                    <label class="form-label">Действие:</label>
                    <textarea class="form-control" data-field="action" rows="2">${step.action}</textarea>
                </div>
                <div class="step-field">
                    <label class="form-label">Ожидаемый результат:</label>
                    <textarea class="form-control" data-field="expectedResult" rows="2">${step.expectedResult}</textarea>
                </div>
            </div>
        `;
        
        stepsList.appendChild(stepElement);
    });
    
    // Обработчики изменений в полях шагов
    stepsList.addEventListener('input', (e) => {
        if (e.target.classList.contains('form-control')) {
            updateStepField(e.target);
        }
    });
}

// Обновление поля шага
function updateStepField(input) {
    const stepItem = input.closest('.step-item');
    const stepId = stepItem.dataset.stepId;
    const fieldName = input.dataset.field;
    const value = input.value;
    
    if (selectedTestCase && selectedTestCase.steps) {
        const step = selectedTestCase.steps.find(s => s.id === stepId);
        if (step) {
            step[fieldName] = value;
        }
    }
}

// Добавление шага
function addStep() {
    if (!selectedTestCase) return;
    
    if (!selectedTestCase.steps) selectedTestCase.steps = [];
    
    const newStep = {
        id: `step-${Date.now()}`,
        action: 'Новое действие',
        expectedResult: 'Ожидаемый результат',
        status: 'not_run',
        bugUrl: ''
    };
    
    selectedTestCase.steps.push(newStep);
    renderSteps(selectedTestCase.steps);
    renderExecutionSteps();
}

// Удаление шага
function removeStep(stepId) {
    if (selectedTestCase && selectedTestCase.steps) {
        selectedTestCase.steps = selectedTestCase.steps.filter(s => s.id !== stepId);
        renderSteps(selectedTestCase.steps);
        renderExecutionSteps();
    }
}

// Сохранение тест-кейса
function saveTestCase(e) {
    e.preventDefault();
    
    if (!selectedTestCase) return;
    
    selectedTestCase.name = document.getElementById('testName').value;
    selectedTestCase.author = document.getElementById('testAuthor').value;
    selectedTestCase.assignee = document.getElementById('testAssignee').value;
    selectedTestCase.status = document.getElementById('testStatus').value;
    selectedTestCase.preconditions = document.getElementById('testPreconditions').value;
    
    // Обновление дерева
    renderNavigatorTree();
    
    // Показать уведомление
    showNotification('Тест-кейс сохранен');
}

// Клонирование тест-кейса
function cloneTestCase() {
    if (!selectedTestCase) return;
    
    const newId = `test-${appData.nextId++}`;
    const clonedTestCase = JSON.parse(JSON.stringify(selectedTestCase));
    
    clonedTestCase.id = newId;
    clonedTestCase.name = `Копия - ${selectedTestCase.name}`;
    clonedTestCase.executionStatus = 'not_run';
    
    // Сброс статусов шагов
    if (clonedTestCase.steps) {
        clonedTestCase.steps.forEach(step => {
            step.status = 'not_run';
            step.bugUrl = '';
        });
    }
    
    appData.testCases[newId] = clonedTestCase;
    
    // Добавление в родительскую папку
    const parentFolder = appData.folders[clonedTestCase.parent];
    if (parentFolder) {
        parentFolder.children.push(newId);
    }
    
    renderNavigatorTree();
    showNotification('Тест-кейс клонирован');
}

// Удаление тест-кейса
function deleteTestCase() {
    if (!selectedTestCase) return;
    
    showConfirmModal(
        'Удаление тест-кейса',
        `Вы действительно хотите удалить тест-кейс "${selectedTestCase.name}"?`,
        () => {
            const testId = selectedTestCase.id;
            const parentId = selectedTestCase.parent;
            
            // Удаление из данных
            delete appData.testCases[testId];
            
            // Удаление из родительской папки
            if (parentId && appData.folders[parentId]) {
                appData.folders[parentId].children = appData.folders[parentId].children.filter(id => id !== testId);
            }
            
            renderNavigatorTree();
            hideTestCaseDetails();
            selectedTestCase = null;
            
            showNotification('Тест-кейс удален');
        }
    );
}

// Отрисовка шагов для выполнения
function renderExecutionSteps() {
    if (!selectedTestCase) return;
    
    const executionSteps = document.getElementById('executionSteps');
    executionSteps.innerHTML = '';
    
    if (!selectedTestCase.steps || selectedTestCase.steps.length === 0) {
        executionSteps.innerHTML = '<p class="empty-state">Шаги не добавлены</p>';
        return;
    }
    
    selectedTestCase.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'execution-step';
        
        const isFailedStep = step.status === 'failed';
        
        // Экранирование HTML и проверка на существование полей
        const action = step.action || 'Действие не указано';
        const expectedResult = step.expectedResult || 'Ожидаемый результат не указан';
        const bugUrl = step.bugUrl || '';
        
        stepElement.innerHTML = `
            <div class="execution-step-header">Шаг ${index + 1}</div>
            <div class="execution-step-content">
                <div class="execution-step-action">
                    <strong>Действие:</strong> ${escapeHtml(action)}
                </div>
                <div class="execution-step-expected">
                    <strong>Ожидаемый результат:</strong> ${escapeHtml(expectedResult)}
                </div>
                <div class="execution-step-controls">
                    <div class="status-buttons">
                        <button class="status-btn status-btn--pass ${step.status === 'passed' ? 'active' : ''}" 
                                onclick="setStepStatus('${step.id}', 'passed')">
                            ✓ Pass
                        </button>
                        <button class="status-btn status-btn--fail ${step.status === 'failed' ? 'active' : ''}" 
                                onclick="setStepStatus('${step.id}', 'failed')">
                            ✗ Failed
                        </button>
                        <button class="status-btn status-btn--skip ${step.status === 'skipped' ? 'active' : ''}" 
                                onclick="setStepStatus('${step.id}', 'skipped')">
                            ⊘ Skip
                        </button>
                    </div>
                    ${isFailedStep ? `
                        <input type="url" class="form-control bug-url-input" 
                               value="${escapeHtml(bugUrl)}" 
                               placeholder="Ссылка на баг..."
                               onchange="setBugUrl('${step.id}', this.value)">
                    ` : ''}
                </div>
            </div>
        `;
        
        executionSteps.appendChild(stepElement);
    });
}

// Функция экранирования HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Установка статуса шага
function setStepStatus(stepId, status) {
    if (!selectedTestCase || !selectedTestCase.steps) return;
    
    const step = selectedTestCase.steps.find(s => s.id === stepId);
    if (step) {
        step.status = status;
        if (status !== 'failed') {
            step.bugUrl = '';
        }
        renderExecutionSteps();
        updateOverallStatus();
    }
}

// Установка ссылки на баг
function setBugUrl(stepId, url) {
    if (!selectedTestCase || !selectedTestCase.steps) return;
    
    const step = selectedTestCase.steps.find(s => s.id === stepId);
    if (step) {
        step.bugUrl = url;
    }
}

// Обновление общего статуса
function updateOverallStatus() {
    if (!selectedTestCase || !selectedTestCase.steps) return;
    
    const steps = selectedTestCase.steps;
    const hasFailedSteps = steps.some(s => s.status === 'failed');
    const allStepsRun = steps.every(s => s.status !== 'not_run');
    const hasSkippedSteps = steps.some(s => s.status === 'skipped');
    
    let overallStatus = 'not_run';
    let statusText = 'Не запущен';
    let statusClass = 'status--info';
    
    if (hasFailedSteps) {
        overallStatus = 'failed';
        statusText = 'Провален';
        statusClass = 'status--error';
    } else if (allStepsRun && !hasSkippedSteps) {
        overallStatus = 'passed';
        statusText = 'Пройден';
        statusClass = 'status--success';
    } else if (allStepsRun && hasSkippedSteps) {
        overallStatus = 'skipped';
        statusText = 'Пропущен';
        statusClass = 'status--warning';
    }
    
    selectedTestCase.executionStatus = overallStatus;
    
    const statusElement = document.getElementById('overallStatus');
    statusElement.textContent = statusText;
    statusElement.className = `status ${statusClass}`;
}

// Завершение выполнения
function finishExecution() {
    if (!selectedTestCase) return;
    
    const execution = {
        id: `exec-${Date.now()}`,
        testCaseId: selectedTestCase.id,
        timestamp: new Date().toISOString(),
        status: selectedTestCase.executionStatus,
        steps: JSON.parse(JSON.stringify(selectedTestCase.steps))
    };
    
    appData.executions.push(execution);
    
    showNotification('Выполнение завершено');
    switchTab('results');
    renderExecutionHistory();
}

// Отрисовка истории выполнений
function renderExecutionHistory() {
    const historyContainer = document.getElementById('executionHistory');
    
    if (!selectedTestCase) {
        historyContainer.innerHTML = '<p class="empty-state">Выберите тест-кейс</p>';
        return;
    }
    
    const executions = appData.executions.filter(e => e.testCaseId === selectedTestCase.id);
    
    if (executions.length === 0) {
        historyContainer.innerHTML = '<p class="empty-state">Выполнений пока нет</p>';
        return;
    }
    
    historyContainer.innerHTML = executions.map(exec => {
        const date = new Date(exec.timestamp).toLocaleString('ru-RU');
        return `
            <div class="card" style="margin-bottom: 16px;">
                <div class="card__body">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>Выполнение от ${date}</strong>
                        </div>
                        <span class="status ${getStatusClass(exec.status)}">${getStatusText(exec.status)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Вспомогательные функции для статусов
function getStatusClass(status) {
    const statusClasses = {
        'passed': 'status--success',
        'failed': 'status--error',
        'skipped': 'status--warning',
        'not_run': 'status--info'
    };
    return statusClasses[status] || 'status--info';
}

function getStatusText(status) {
    const statusTexts = {
        'passed': 'Пройден',
        'failed': 'Провален',
        'skipped': 'Пропущен',
        'not_run': 'Не запущен'
    };
    return statusTexts[status] || 'Неизвестно';
}

// Создание папки
function createFolder(parentId) {
    showInputModal('Создание папки', 'Введите название папки:', (name) => {
        if (!name.trim()) return;
        
        const newId = `folder-${Date.now()}`;
        const newFolder = {
            id: newId,
            name: name.trim(),
            type: 'folder',
            parent: parentId,
            children: []
        };
        
        appData.folders[newId] = newFolder;
        appData.folders[parentId].children.push(newId);
        
        renderNavigatorTree();
        showNotification('Папка создана');
    });
}

// Создание тест-кейса
function createTestCase(parentId) {
    showInputModal('Создание тест-кейса', 'Введите название тест-кейса:', (name) => {
        if (!name.trim()) return;
        
        const newId = `test-${appData.nextId++}`;
        const newTestCase = {
            id: newId,
            name: name.trim(),
            author: '',
            assignee: '',
            status: 'draft',
            tags: [],
            preconditions: '',
            steps: [],
            executionStatus: 'not_run',
            parent: parentId
        };
        
        appData.testCases[newId] = newTestCase;
        appData.folders[parentId].children.push(newId);
        
        renderNavigatorTree();
        showNotification('Тест-кейс создан');
    });
}

// Контекстное меню
function handleTreeContextMenu(e) {
    e.preventDefault();
    const treeNode = e.target.closest('.tree-node');
    if (!treeNode) return;
    
    const nodeId = treeNode.dataset.id;
    const nodeType = treeNode.dataset.type;
    
    showContextMenu(e.clientX, e.clientY, nodeId, nodeType);
}

function showContextMenu(x, y, nodeId, nodeType) {
    const menu = document.getElementById('contextMenu');
    const items = menu.querySelectorAll('.context-menu-item');
    
    // Показать/скрыть пункты меню в зависимости от типа узла
    items.forEach(item => {
        const action = item.dataset.action;
        let show = true;
        
        if (nodeType === 'testcase') {
            show = ['rename', 'delete', 'clone', 'run'].includes(action);
        } else if (nodeType === 'folder') {
            show = ['rename', 'delete', 'create-folder', 'create-test', 'run'].includes(action);
        }
        
        item.style.display = show ? 'block' : 'none';
    });
    
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.remove('hidden');
    
    currentContextMenu = { nodeId, nodeType };
    
    // Обработчики для пунктов меню
    menu.onclick = handleContextMenuClick;
}

function handleContextMenuClick(e) {
    const action = e.target.dataset.action;
    if (!action || !currentContextMenu) return;
    
    const { nodeId, nodeType } = currentContextMenu;
    
    switch (action) {
        case 'rename':
            renameNode(nodeId, nodeType);
            break;
        case 'delete':
            deleteNode(nodeId, nodeType);
            break;
        case 'clone':
            cloneNode(nodeId, nodeType);
            break;
        case 'run':
            runNode(nodeId, nodeType);
            break;
        case 'create-folder':
            createFolder(nodeId);
            break;
        case 'create-test':
            createTestCase(nodeId);
            break;
    }
    
    hideContextMenu();
}

function hideContextMenu() {
    document.getElementById('contextMenu').classList.add('hidden');
    currentContextMenu = null;
}

// Операции с узлами
function renameNode(nodeId, nodeType) {
    const node = nodeType === 'folder' ? appData.folders[nodeId] : appData.testCases[nodeId];
    if (!node) return;
    
    showInputModal('Переименование', 'Введите новое название:', (newName) => {
        if (!newName.trim()) return;
        
        node.name = newName.trim();
        renderNavigatorTree();
        
        if (selectedTestCase && selectedTestCase.id === nodeId) {
            document.getElementById('testName').value = newName.trim();
        }
        
        showNotification('Переименовано');
    }, node.name);
}

function deleteNode(nodeId, nodeType) {
    const node = nodeType === 'folder' ? appData.folders[nodeId] : appData.testCases[nodeId];
    if (!node) return;
    
    showConfirmModal(
        'Удаление',
        `Вы действительно хотите удалить "${node.name}"?`,
        () => {
            if (nodeType === 'folder') {
                // Удаление папки со всем содержимым
                deleteFolderRecursive(nodeId);
            } else {
                // Удаление тест-кейса
                delete appData.testCases[nodeId];
                
                // Удаление из родительской папки
                const parentId = node.parent;
                if (parentId && appData.folders[parentId]) {
                    appData.folders[parentId].children = appData.folders[parentId].children.filter(id => id !== nodeId);
                }
            }
            
            renderNavigatorTree();
            if (selectedTestCase && selectedTestCase.id === nodeId) {
                hideTestCaseDetails();
                selectedTestCase = null;
            }
            
            showNotification('Удалено');
        }
    );
}

function deleteFolderRecursive(folderId) {
    const folder = appData.folders[folderId];
    if (!folder) return;
    
    // Рекурсивное удаление дочерних элементов
    if (folder.children) {
        folder.children.forEach(childId => {
            if (appData.folders[childId]) {
                deleteFolderRecursive(childId);
            } else if (appData.testCases[childId]) {
                delete appData.testCases[childId];
            }
        });
    }
    
    // Удаление папки
    delete appData.folders[folderId];
    
    // Удаление из родительской папки
    if (folder.parent && appData.folders[folder.parent]) {
        appData.folders[folder.parent].children = appData.folders[folder.parent].children.filter(id => id !== folderId);
    }
}

// Поиск
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const treeNodes = document.querySelectorAll('.tree-node');
    
    treeNodes.forEach(node => {
        const label = node.querySelector('.tree-label').textContent.toLowerCase();
        const id = node.dataset.id.toLowerCase();
        const matches = label.includes(searchTerm) || id.includes(searchTerm);
        
        node.style.display = matches || searchTerm === '' ? 'flex' : 'none';
        
        // Показать родительские папки для найденных элементов
        if (matches && searchTerm !== '') {
            let parent = node.closest('.tree-children');
            while (parent) {
                parent.classList.remove('collapsed');
                parent = parent.parentElement.closest('.tree-children');
            }
        }
    });
}

// Запуск всех тестов
function runAllTests() {
    showConfirmModal(
        'Запуск всех тестов',
        'Вы действительно хотите запустить все тест-кейсы?',
        () => {
            Object.values(appData.testCases).forEach(testCase => {
                testCase.executionStatus = 'passed'; // Имитация успешного выполнения
                if (testCase.steps) {
                    testCase.steps.forEach(step => {
                        step.status = 'passed';
                    });
                }
            });
            
            renderExecutionSteps();
            updateOverallStatus();
            showNotification('Все тесты запущены');
        }
    );
}

// Сброс статусов
function resetAllStatuses() {
    showConfirmModal(
        'Сброс статусов',
        'Вы действительно хотите сбросить статусы всех тест-кейсов?',
        () => {
            Object.values(appData.testCases).forEach(testCase => {
                testCase.executionStatus = 'not_run';
                if (testCase.steps) {
                    testCase.steps.forEach(step => {
                        step.status = 'not_run';
                        step.bugUrl = '';
                    });
                }
            });
            
            appData.executions = [];
            
            renderExecutionSteps();
            updateOverallStatus();
            renderExecutionHistory();
            showNotification('Статусы сброшены');
        }
    );
}

// Экспорт результатов
function exportResults() {
    const allureData = {
        testCases: Object.values(appData.testCases).map(testCase => ({
            uuid: testCase.id,
            name: testCase.name,
            fullName: testCase.name,
            labels: (testCase.tags || []).map(tag => ({ name: 'tag', value: tag })),
            status: testCase.executionStatus,
            statusDetails: {},
            steps: (testCase.steps || []).map(step => ({
                name: step.action,
                status: step.status === 'not_run' ? 'skipped' : step.status,
                statusDetails: step.bugUrl ? { message: `Bug: ${step.bugUrl}` } : {}
            })),
            parameters: [],
            attachments: []
        })),
        executions: appData.executions
    };
    
    const dataStr = JSON.stringify(allureData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Результаты экспортированы');
}

// Настройка Drag & Drop
function setupDragAndDrop() {
    const treeContainer = document.getElementById('navigatorTree');
    
    treeContainer.addEventListener('dragstart', handleDragStart);
    treeContainer.addEventListener('dragover', handleDragOver);
    treeContainer.addEventListener('drop', handleDrop);
    treeContainer.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    const treeNode = e.target.closest('.tree-node');
    if (!treeNode) return;
    
    draggedElement = {
        id: treeNode.dataset.id,
        type: treeNode.dataset.type,
        element: treeNode
    };
    
    treeNode.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    const treeNode = e.target.closest('.tree-node');
    
    if (treeNode && treeNode.dataset.type === 'folder' && draggedElement) {
        treeNode.classList.add('drop-target');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const treeNode = e.target.closest('.tree-node');
    
    if (treeNode && treeNode.dataset.type === 'folder' && draggedElement) {
        const targetId = treeNode.dataset.id;
        const sourceId = draggedElement.id;
        
        if (targetId !== sourceId) {
            moveNode(sourceId, targetId, draggedElement.type);
        }
    }
    
    // Убираем визуальную обратную связь
    document.querySelectorAll('.drop-target').forEach(node => {
        node.classList.remove('drop-target');
    });
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.element.classList.remove('dragging');
        draggedElement = null;
    }
    
    document.querySelectorAll('.drop-target').forEach(node => {
        node.classList.remove('drop-target');
    });
}

function moveNode(nodeId, newParentId, nodeType) {
    const node = nodeType === 'folder' ? appData.folders[nodeId] : appData.testCases[nodeId];
    if (!node) return;
    
    const oldParentId = node.parent;
    
    // Удаляем из старого родителя
    if (oldParentId && appData.folders[oldParentId]) {
        appData.folders[oldParentId].children = appData.folders[oldParentId].children.filter(id => id !== nodeId);
    }
    
    // Добавляем к новому родителю
    if (appData.folders[newParentId]) {
        appData.folders[newParentId].children.push(nodeId);
        node.parent = newParentId;
    }
    
    renderNavigatorTree();
    showNotification('Элемент перемещен');
}

// Модальные окна
function setupModalListeners() {
    // Подтверждение
    document.getElementById('confirmYes').addEventListener('click', () => {
        if (window.confirmCallback) {
            window.confirmCallback();
            window.confirmCallback = null;
        }
        hideModal('confirmModal');
    });
    
    document.getElementById('confirmNo').addEventListener('click', () => {
        window.confirmCallback = null;
        hideModal('confirmModal');
    });
    
    // Ввод
    document.getElementById('inputOk').addEventListener('click', () => {
        const value = document.getElementById('inputField').value;
        if (window.inputCallback) {
            window.inputCallback(value);
            window.inputCallback = null;
        }
        hideModal('inputModal');
    });
    
    document.getElementById('inputCancel').addEventListener('click', () => {
        window.inputCallback = null;
        hideModal('inputModal');
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal('confirmModal');
            hideModal('inputModal');
        }
    });
}

function showConfirmModal(title, message, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    window.confirmCallback = callback;
    showModal('confirmModal');
}

function showInputModal(title, placeholder, callback, defaultValue = '') {
    document.getElementById('inputTitle').textContent = title;
    const inputField = document.getElementById('inputField');
    inputField.placeholder = placeholder;
    inputField.value = defaultValue;
    window.inputCallback = callback;
    showModal('inputModal');
    setTimeout(() => inputField.focus(), 100);
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Уведомления
function showNotification(message) {
    // Простое уведомление через alert (можно заменить на более красивое)
    console.log('Уведомление:', message);
    // В реальном приложении здесь был бы toast или notification
}