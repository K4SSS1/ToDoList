import React, { useState, useEffect } from 'react'; //osnovnble functions from react
import 'bootstrap/dist/css/bootstrap.min.css'; // import obshego bootstrapa 
<link rel="stylesheet" href="index.css"></link> // import bootstrapa iz faila index.css

type Task = { // opredelenie tipa task 
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
};
//  при монтировании апп список задач восстановленн из локал сторадж 
const App = () => { // модуль 
  const [tasks, setTasks] = useState<Task[]>(() => { //sostoyanie spiska zada4  ispolzuets9 'usestate' dl9 inicializacii coctoyani9 spiska zada4
    const savedTasks = localStorage.getItem('tasks');// если в localstorage найденны сохраненные задачи, то они используются иначе список пуст 
    if (savedTasks) { //с помощью json parse они извлекаются из строки попутно переходя в объекты джс
      return JSON.parse(savedTasks);
    }
    return [];
  });
// useeffect dl9 pobo4nblh effectov 
  useEffect(() => { // useeffect нужен для автосейва задач в локалсторадж при любых изменениях 
    localStorage.setItem('tasks', JSON.stringify(tasks));//конкретно здесь под ключем таскс , сохраняются в localstarage в формате json
  }, [tasks]); // массив зависимостей, если тут чето изменится то юзЭффект прогонится заново 

  const [newTask, setNewTask] = useState<string>(''); //хранение текста задачи 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // обработчик события  для поля инпут филд то есть куда вводим задачу 
    setNewTask(e.target.value); // обновляется состояние ньютаск//таргет валуе - новое значение состояния, каждый раз когда ввожу текст в поле ввода  нью таск обновляется с этим текстом 
  };
// e - объект который передасться в ф-цию
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { //добавление задачи онли если текст задачи не пустой, 
                                                                  //как был прикол с багом на первых версиях/ так же очищается состояние newtask потому что задание добавленно и нужно очистить для нового 
    e.preventDefault();
    if (newTask.trim()!== '') {// trim - удаление пробелов в конце и начале строки. туут это для проверки что пользователь действительно что-то ввел, а не просто нажал на кнопку
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, important: false }]); // date now - текущее время в миллисекундах, что является айдишником 
      setNewTask('');//сброс состояния что бы была после добавления задачи пустая строка
    }
  };
// таскс это текущее состояние списка 
  const removeTask = (id: number) => { // удаление задачи (происходит по айди)
    const updatedTasks = tasks.filter((task: Task) => task.id!== id); // создание нового массива из которого уже будет исключен тот айди который был получен
    setTasks(updatedTasks); // обновление состояния списка задач 
  };
// переключение статуса выполнения (происходит по айди)
  const toggleCompleted = (id: number) => { 
    const updatedTasks = tasks.map((task: Task) => // map - для создания нового массива на основе исходного таскс
      task.id === id? {...task, completed:!task.completed } : task // ф-ция обратного вызова, если айди текущей задачи совпадает с полученным 
    );// создается новая задача с теми же свойствами но только с измененным свойством complete 
    setTasks(updatedTasks);// обновление состояния списка задач 
  };
 // переключение важности задач
  const toggleImportant = (id: number) => { 
    const updatedTasks = tasks.map((task: Task) => // все тоже самое что и блоком выше, но с важностью задачи 
      task.id === id? {...task, important:!task.important } : task
    );
    setTasks(updatedTasks);
  };

  // useState — это хук React, который позволяет добавлять состояние в функциональные компоненты.//
// фильтр задач по статусам
  const [filter, setFilter] = useState<'all' | 'completed' | 'important' | 'in-progress'>('all'); //фильтр может ринимать одно из данных значений, по умолчанию идет all
 
  const filteredTasks = tasks.filter((task: Task) => { // метод filter для креэйта нового массива tasks но удовлетворение должно идти по условиям поиска 
    switch (filter) {
      case 'completed':
        return task.completed;
      case 'important':
        return task.important;
      case 'in-progress':
        return!task.completed && (!task.important || task.important); // таск может же быть и важным и не важным но в процессе выполнения 
      default:
        return true; // если условия не выполены то возвращается true и показываются все таски 
    }
  });

  return ( // рендер всего 
    <div className="container mt-5">  {/* общий контейнер, container - centrovanie mt-5 verhnii otstup */}
      <h1 className="mb-4">Todo List</h1> {/* заголовок */}
      <form onSubmit={handleSubmit} className="mb-3"> {/* вызов hundlesubmit */}
       {/*форма добавления задач*/}
        <input  
          type="text"
          value={newTask}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Введите задачу"
        />
        <button type="submit" className="btn btn-primary otstup-werh krai">Добавить</button>
      </form>
      <ul className="list-group"> {/* когда появляется задача возле нее есть кнопки для пометок разного тут они */}
        {filteredTasks.map((task: Task) => (
          <li key={task.id} className={`list-group-item ${task.important? 'bg-warning' : ''}`}> {/* бг желтый если прожато важность  */}
            <span style={{ textDecoration: task.completed? "line-through" : "" }}>{task.text}</span> {/* зачеркнуто если выполненно */}
            <button onClick={() => removeTask(task.id)} className="btn btn-danger  first-buttonotstup krai">Удалить</button>
            <button onClick={() => toggleCompleted(task.id)} className="btn btn-success otstup krai">Отметить выполненной</button>
            <button onClick={() => toggleImportant(task.id)} className="btn btn-warning krai">Отметить важной</button>
          </li>
        ))}
      </ul>
      <div className="mt-3">   {/* типы фильтрации и как они будут называться для пользователя */}
        <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'important' | 'in-progress')} className="form-select">
          <option value="all">Все задачи</option>
          <option value="completed">Выполненные</option>
          <option value="important">Важные</option>
          <option value="in-progress">В процессе выполнения</option>
        </select>
      </div>
    </div>
  );
};

export default App; // Компонент App экспортируется как модуль по умолчанию, что позволяет его импортировать и использовать в других частях приложения,

// npx create-react-app todo-list --template typescript
// cd todo-list