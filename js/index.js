const addNewTask = document.querySelector('#addNewTask');
const formAddTask = document.querySelector('#formAddTask');
const addInputName = document.querySelector('#addInputName');
const addInputDescription = document.querySelector('#addInputDescription');
const addInputAssignedTo = document.querySelector('#addInputAssignedTo');
const addInputDueDate = document.querySelector('#addInputDueDate');
const addInputStatus = document.querySelector('#addInputStatus');
const addSubmitBtn = document.querySelector('#addSubmitBtn');
const addResetBtn = document.querySelector('#addResetBtn');
const addCloseModal = document.querySelector('#addCloseModal');
const showTaskList = document.querySelector('#showTaskList');

let editInputId = document.querySelector('#editInputId');
let editInputName = document.querySelector('#editInputName');
let editInputDescription = document.querySelector('#editInputDescription');
let editInputAssignedTo = document.querySelector('#editInputAssignedTo');
let editInputDueDate = document.querySelector('#editInputDueDate');
let editInputStatus = document.querySelector('#editInputStatus');
let editSaveBtn = document.querySelector('#editSaveBtn');
let editResetBtn = document.querySelector('#editResetBtn');
let editCloseModal = document.querySelector('#editCloseModal');
let editBtn = document.getElementsByClassName('editBtn');

let editInputNamePrev;
let editInputDescriptionPrev;
let editInputAssignedToPrev;
let editInputDueDatePrev;
let editInputStatusPrev;

const showDate = document.querySelector('#showDate');
const showTime = document.querySelector('#showTime');

// Select each Status column (Todo, InProgress, Review, Done)
const todoColumn = document.querySelector('#todoColumn');
const inProgressColumn = document.querySelector('#inProgressColumn');
const reviewColumn = document.querySelector('#reviewColumn');
const doneColumn = document.querySelector('#doneColumn');

// Task Class: Represents a Task Object
class Task {
  constructor(id, name, description, assignedTo, dueDate, status) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.assignedTo = assignedTo;
    this.dueDate = dueDate;
    this.status = status;
  }
}

// TaskManager Class: Represents methods in TaskManager Class
class TaskManager {
  static getTaskListFromLocalStorage() {
    let taskList = localStorage.getItem('taskList');
    if (taskList === null) {
      taskList = [];
    } else {
      taskList = JSON.parse(taskList);
    }
    return taskList;
  }

  static getAllTasks() {
    const tasks = TaskManager.getTaskListFromLocalStorage();
    tasks.forEach(task => TaskManager.render(task));
  }

  static getTasksWithStatus(status) {
    const allTasksWithSameStatus = taskArray.filter(
      task => task.status === status
    );
  }

  // Add a New Task Object to localStorage
  static addTask(task) {
    const taskList = TaskManager.getTaskListFromLocalStorage();
    taskList.push(task);
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }

  static createTaskHTML(task) {
    TaskManager.render(task);
  }

  static render(task) {
    const divElement = document.createElement('div');
    divElement.classList.add('col-12', 'text-start', 'mb-2');
    divElement.innerHTML = `<div class='card border-secondary'>
    <div class='card-body boxShadow'>
      <h5 class='card-title fs-4 pb-3 text-capitalize'>${task.name}</h5>
      <p class='card-text pb-3 firstLetter'>${task.description}</p>
      <p class='card-text text-capitalize'><span class='fw-bold pe-3'>Assigned to :</span>${
        task.assignedTo
      }</p>
      <p class='card-text'><span class='fw-bold pe-3'>Due Date :</span>${
        task.dueDate
      }</p>
      <p class='card-text pb-3 text-capitalize'><span class='fw-bold pe-3'>Status :</span><span class=${TaskManager.checkBackgroundColor(
        task.status
      )}>${task.status}</span></p>
      <div class='col d-flex justify-content-between align-items-center'>
        <div style='display:none'>${task.id}</div>
        <button class='btn border-dark delete' type='submit'>Delete</button>
        ${
          task.status === 'done'
            ? `<span></span>`
            : `<button type='button' class='btn border border-dark taskStatus'>Mark as Done</button>`
        }
        <button class='btn border border-dark edit editRemoveFocus' type='submit' data-bs-toggle='modal' data-bs-target='#staticEditBackdrop'>Edit</button>
      </div>
    </div>
    </div>`;

    // Render a Task to each status column, by checking its status
    let statusColumn = TaskManager.addToStatusColumn(task.status);
    statusColumn.appendChild(divElement);
  }

  // Return ID of column, depend on Status
  static addToStatusColumn(status) {
    switch (status) {
      case 'todo':
        return todoColumn;
      case 'in progress':
        return inProgressColumn;
      case 'review':
        return reviewColumn;
      case 'done':
        return doneColumn;
    }
  }

  // Assign background color to Status of each Task Card
  static checkBackgroundColor(status) {
    switch (status) {
      case 'todo':
        return 'red';
      case 'done':
        return 'green';
      case 'in progress':
        return 'orange';
      case 'review':
        return 'blue';
    }
  }

  // Called when Save Button on Edit-a-Task form is clicked
  static saveEditedTask(e) {
    e.preventDefault();
    const taskId =
      e.target.previousElementSibling.previousElementSibling.textContent;

    let taskList = localStorage.getItem('taskList');
    taskList = JSON.parse(taskList);
    taskList.forEach(task => {
      if (task.id === taskId) {
        task.name = editInputName.value;
        task.description = editInputDescription.value;
        task.assignedTo = editInputAssignedTo.value;
        task.dueDate = editInputDueDate.value;
        task.status = editInputStatus.value;
      }
    });

    // Save edited Task to localStorage
    localStorage.setItem('taskList', JSON.stringify(taskList));

    // To fix the Modal from not closing after click Save button (from e.preventDefault());
    editSaveBtn.setAttribute('data-bs-dismiss', 'modal');
    editSaveBtn.click();
    // To remove this attribute from the modal (IIFE)
    (() => {
      editSaveBtn.setAttribute('data-bs-dismiss', '');
    })();
  }

  // Called when Reset Button on Edit-a-Task form is clicked
  static resetEditedTask(e) {
    e.preventDefault();
    editInputName.value = editInputNamePrev;
    editInputDescription.value = editInputDescriptionPrev;
    editInputAssignedTo.value = editInputAssignedToPrev;
    editInputDueDate.value = editInputDueDatePrev;
    editInputStatus.value = editInputStatusPrev;
  }

  // Called when Edit Button is clicked on each Task
  static editTask(e) {
    const taskId =
      e.target.previousElementSibling.previousElementSibling
        .previousElementSibling.textContent;

    let taskList = localStorage.getItem('taskList');
    taskList = JSON.parse(taskList);
    const editedTask = taskList.filter(task => task.id === taskId);

    editInputId.textContent = taskId;
    editInputName.value = editedTask[0].name;
    editInputDescription.value = editedTask[0].description;
    editInputAssignedTo.value = editedTask[0].assignedTo;
    editInputDueDate.value = editedTask[0].dueDate;
    editInputStatus.value = editedTask[0].status;

    editInputNamePrev = editedTask[0].name;
    editInputDescriptionPrev = editedTask[0].description;
    editInputAssignedToPrev = editedTask[0].assignedTo;
    editInputDueDatePrev = editedTask[0].dueDate;
    editInputStatusPrev = editedTask[0].status;
  }

  // Called when Delete Button is clicked
  static deleteTaskFromLocalStorage(e) {
    let tasks = TaskManager.getTaskListFromLocalStorage();
    const idOfElement = e.target.previousElementSibling.textContent;

    tasks = tasks.filter(task => task.id !== idOfElement);
    localStorage.setItem('taskList', JSON.stringify(tasks));
  }

  // Called when Delete Button is clicked
  static deleteTaskFromUI(elementTarget) {
    if (elementTarget.classList.contains('delete')) {
      elementTarget.parentElement.parentElement.parentElement.parentElement.remove();
    }
  }

  // Called when Mark-as-Done Button is clicked
  static markAsDone(e) {
    const taskId =
      e.target.previousElementSibling.previousElementSibling.textContent;
    let taskList = localStorage.getItem('taskList');
    taskList = JSON.parse(taskList);
    taskList.forEach(task => {
      if (task.id === taskId) {
        task.status = 'done';
      }
    });
    localStorage.setItem('taskList', JSON.stringify(taskList));

    todoColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    reviewColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    TaskManager.getAllTasks();
  }
}

// Validation Class: Handles all validations
class Validation {
  static isRequired(input) {
    return input === '' ? false : true;
  }

  static isMoreThan(inputLength, min) {
    return inputLength >= min ? true : false;
  }

  static isFormattedDate(input) {
    const pattern =
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    return input.match(pattern);
  }

  static showError(input, message) {
    const formField = input.parentElement;
    const small = formField.querySelector('small');
    small.textContent = message;
  }

  static showSuccess(input) {
    const formfield = input.parentElement;
    const small = formfield.querySelector('small');
    small.textContent = '';
  }

  ///////////////////// Validation for Add-New-Task form /////////////////////
  static addCheckName() {
    let valid = false;
    const min = 8;
    const name = addInputName.value.trim();

    if (!Validation.isRequired(name)) {
      Validation.showError(
        addInputName,
        `Name cannot be blank and at least ${min} characters long.`
      );
    } else if (!Validation.isMoreThan(name.length, min)) {
      Validation.showError(
        addInputName,
        `Name must be more than ${min} characters.`
      );
    } else {
      Validation.showSuccess(addInputName);
      valid = true;
    }
    return valid;
  }

  static addCheckDescription() {
    let valid = false;
    const min = 15;
    const description = addInputDescription.value.trim();

    if (!Validation.isRequired(description)) {
      Validation.showError(
        addInputDescription,
        `Description cannot be blank and at least ${min} characters long.`
      );
    } else if (!Validation.isMoreThan(description.length, min)) {
      Validation.showError(
        addInputDescription,
        `Description must be more than ${min} characters.`
      );
    } else {
      Validation.showSuccess(addInputDescription);
      valid = true;
    }
    return valid;
  }

  static addCheckAssignedTo() {
    let valid = false;
    const min = 8;
    const assignedTo = addInputAssignedTo.value.trim();

    if (!Validation.isRequired(assignedTo)) {
      Validation.showError(
        addInputAssignedTo,
        `AssignedTo cannot be blank and at least ${min} characters long.`
      );
    } else if (!Validation.isMoreThan(assignedTo.length, min)) {
      Validation.showError(
        addInputAssignedTo,
        `AssignedTo must be more than ${min} characters.`
      );
    } else {
      Validation.showSuccess(addInputAssignedTo);
      valid = true;
    }
    return valid;
  }

  static addCheckDueDate() {
    let valid = false;
    const dueDate = addInputDueDate.value.trim();
    if (!Validation.isRequired(dueDate)) {
      Validation.showError(
        addInputDueDate,
        'Due date cannot be blank and cannot select past date.'
      );
    } else if (!Validation.isFormattedDate(dueDate)) {
      Validation.showError(
        addInputDueDate,
        'Due date have to be in this format : DD-MM-YYYY'
      );
    } else {
      Validation.showSuccess(addInputDueDate);
      valid = true;
    }
    return valid;
  }

  static addCheckStatus() {
    let valid = false;
    const status = addInputStatus.value.trim();
    if (Validation.isRequired(status)) {
      Validation.showSuccess(addInputStatus);
      valid = true;
    } else {
      Validation.showError(addInputStatus, 'Status cannot be blank.');
    }
    return valid;
  }

  static validateAddTaskForm() {
    let valid = false;
    let isNameValid = Validation.addCheckName(),
      isDescriptionValid = Validation.addCheckDescription(),
      isAssignedToValid = Validation.addCheckAssignedTo(),
      isDueDateValid = Validation.addCheckDueDate(),
      isStatusValid = Validation.addCheckStatus();

    let isFormValid =
      isNameValid &&
      isDescriptionValid &&
      isAssignedToValid &&
      isDueDateValid &&
      isStatusValid;

    if (isFormValid) {
      // To fix the Modal from not closing after click Submit button (from e.preventDefault());
      addSubmitBtn.setAttribute('data-bs-dismiss', 'modal');
      addSubmitBtn.click();
      // To remove this attribute from the modal (IIFE)
      (() => {
        addSubmitBtn.setAttribute('data-bs-dismiss', '');
      })();
      valid = true;
    }
    return valid;
  }

  ///////////////////// Validation for Edit-a-Task form /////////////////////
  static editCheckName() {
    let valid = false;
    const min = 8;
    const name = editInputName.value.trim();

    if (!Validation.isRequired(name)) {
      Validation.showError(
        editInputName,
        `Name cannot be blank and at least ${min} characters long.`
      );
    } else if (!Validation.isMoreThan(name.length, min)) {
      Validation.showError(
        editInputName,
        `Name must be more than ${min} characters.`
      );
    } else {
      Validation.showSuccess(editInputName);
      valid = true;
    }
    return valid;
  }

  static editCheckDescription() {
    let valid = false;
    const min = 15;
    const description = editInputDescription.value.trim();

    if (!Validation.isRequired(description)) {
      Validation.showError(
        editInputDescription,
        `Description cannot be blank and at least ${min} characters long.`
      );
    } else if (!Validation.isMoreThan(description.length, min)) {
      Validation.showError(
        editInputDescription,
        `Description must be more than ${min} characters.`
      );
    } else {
      Validation.showSuccess(editInputDescription);
      valid = true;
    }
    return valid;
  }

  static editCheckAssignedTo() {
    let valid = false;
    const min = 8;
    const assignedTo = editInputAssignedTo.value.trim();

    if (!Validation.isRequired(assignedTo)) {
      Validation.showError(
        editInputAssignedTo,
        `AssignedTo cannot be blank and at least ${min} characters long.`
      );
    } else if (!Validation.isMoreThan(assignedTo.length, min)) {
      Validation.showError(
        editInputAssignedTo,
        `AssignedTo must be more than ${min} characters.`
      );
    } else {
      Validation.showSuccess(editInputAssignedTo);
      valid = true;
    }
    return valid;
  }

  static editCheckDueDate() {
    let valid = false;
    const dueDate = editInputDueDate.value.trim();
    if (!Validation.isRequired(dueDate)) {
      Validation.showError(
        editInputDueDate,
        'Due date cannot be blank and cannot select past date.'
      );
    } else if (!Validation.isFormattedDate(dueDate)) {
      Validation.showError(
        editInputDueDate,
        'Due date have to be in this format : DD-MM-YYYY'
      );
    } else {
      Validation.showSuccess(editInputDueDate);
      valid = true;
    }
    return valid;
  }

  static editCheckStatus() {
    let valid = false;
    const status = editInputStatus.value.trim();
    if (Validation.isRequired(status)) {
      Validation.showSuccess(editInputStatus);
      valid = true;
    } else {
      Validation.showError(editInputStatus, 'Status cannot be blank.');
    }
    return valid;
  }

  static resetAddFormFields() {
    Validation.showSuccess(addInputName);
    Validation.showSuccess(addInputDescription);
    Validation.showSuccess(addInputAssignedTo);
    Validation.showSuccess(addInputDueDate);
    Validation.showSuccess(addInputStatus);
    formAddTask.reset();
  }

  static validateEditTaskForm() {
    let valid = false;
    let isNameValid = Validation.editCheckName(),
      isDescriptionValid = Validation.editCheckDescription(),
      isAssignedToValid = Validation.editCheckAssignedTo(),
      isDueDateValid = Validation.editCheckDueDate(),
      isStatusValid = Validation.editCheckStatus();

    let isFormValid =
      isNameValid &&
      isDescriptionValid &&
      isAssignedToValid &&
      isDueDateValid &&
      isStatusValid;

    if (isFormValid) {
      valid = true;
    }
    return valid;
  }
}

// Utility Class: Provides utility methods
class Utility {
  // Create an unique ID (Example : '108c3ec7-4c38-48d2-91e8-4475b43d806c)
  static create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  static showDate() {
    const date = new Date();
    const today =
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    const myDateSpan = document.createElement('span');
    myDateSpan.textContent = today;
    return myDateSpan;
  }

  static showTime() {
    const date = new Date();
    const myTimeSpan = document.createElement('span');
    myTimeSpan.textContent = date.toLocaleTimeString();
    return myTimeSpan;
  }
}

///////////////////////////////////////////////////////// ALL EVENT SECTIONS /////////////////////////////////////////////////////////

// Display all Tasks on screen when page is loaded
document.addEventListener('DOMContentLoaded', TaskManager.getAllTasks);

// Display Date and Time when page is load
showDate.appendChild(Utility.showDate());
showTime.appendChild(Utility.showTime());

// Handle when Submit button on Add-New-Task form is clicked
formAddTask.addEventListener('submit', e => {
  e.preventDefault();
  const isAddFormValid = Validation.validateAddTaskForm();
  if (isAddFormValid) {
    const id = Utility.create_UUID();
    const name = addInputName.value;
    const description = addInputDescription.value;
    const assignedTo = addInputAssignedTo.value;
    const dueDate = addInputDueDate.value;
    const status = addInputStatus.value;

    const task = new Task(id, name, description, assignedTo, dueDate, status);

    // Add a New Task Object to localStorage and render on the screen
    TaskManager.addTask(task);
    TaskManager.createTaskHTML(task);

    // Reset Add-New-Task form
    Validation.resetAddFormFields();
  }
});

// Handle when Reset button on Add-New-Task form is clicked
addResetBtn.addEventListener('click', Validation.resetAddFormFields);

// Handle when X button on Add-New-Task form is clicked
addCloseModal.addEventListener('click', Validation.resetAddFormFields);

// Handle when Save Button on Edit-a-Task form is clicked
editSaveBtn.addEventListener('click', e => {
  e.preventDefault();
  const isEditFormValid = Validation.validateEditTaskForm();
  if (isEditFormValid) {
    TaskManager.saveEditedTask(e);
    todoColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    reviewColumn.innerHTML = '';
    doneColumn.innerHTML = '';
    TaskManager.getAllTasks();
  }
});

// Handle when Reset Button on Edit-a-Task form is clicked
editResetBtn.addEventListener('click', TaskManager.resetEditedTask);

// Listen to events from each Task Card (Delete or Mark as Done or Edit button is clicked)
showTaskList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    TaskManager.deleteTaskFromUI(e.target);
    TaskManager.deleteTaskFromLocalStorage(e);
  } else if (e.target.classList.contains('taskStatus')) {
    TaskManager.markAsDone(e);
  } else if (e.target.classList.contains('edit')) {
    TaskManager.editTask(e);
  }
});
