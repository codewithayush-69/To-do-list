const buttons = document.querySelectorAll(".nav-menu a");
const pages = document.querySelectorAll(".page");
const progressPage = document.getElementById("progress-list");
const form = document.getElementById("task-form");
const totalTaskCount = document.getElementById("total-tasks");
const pendingTaskCount = document.getElementById("pending-tasks");
const completedTaskCount = document.getElementById("completed-tasks");
const toggleBtn = document.getElementById("toggle");
let deletedTasks = {};

document.addEventListener("DOMContentLoaded", function () {
    
        toggleBtn.addEventListener("click", function () {
            pages.forEach(page => page.classList.toggle("active-dark"));
        });     
});


buttons.forEach(button => {
    button.addEventListener("click", function () {
        navigateTo(this.getAttribute("data-target"));
    });
});

document.getElementById("newtask-btn").onclick = () => navigateTo("create");
document.getElementById("progress-btn").onclick = () => navigateTo("progress");
document.getElementById("complete-btn").onclick = () => navigateTo("completed");

function navigateTo(pageId) {
    pages.forEach(page => page.style.display = "none");
    document.getElementById(pageId).style.display = "block";
}
function navigateTo(pageId) {
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.add("active");
        } else {
            page.classList.remove("active");
        }
    });
}


form.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskTitle = document.getElementById("task-title").value;
    const taskDesc = document.getElementById("task-desc").value;
    const taskDate = document.getElementById("task-date").value;
    const taskPriority = document.getElementById("task-priority").value;
    const taskCategory = document.getElementById("task-category").value;

    if (!taskTitle || !taskDate || !taskPriority || !taskCategory) {
        alert("Please fill in all fields");
        return;
    }
    
    if (new Date(taskDate) < new Date().setHours(0, 0, 0, 0)) {
        alert("You cannot select a past date");
        return;
    }

    let task = `Task: ${taskTitle}<br>Description: ${taskDesc}<br>Date: ${taskDate}<br>Priority: ${taskPriority}<br>Category: ${taskCategory}`;
    
    addProgress(task);
    form.reset();
});

function addProgress(taskName) {
    let li = document.createElement("li");
    li.innerHTML = taskName;
    progressPage.appendChild(li);

    const actionDiv = document.createElement("div");
    actionDiv.className = "task-actions";
    li.appendChild(actionDiv);

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete";
    completeBtn.textContent = "Complete";
    actionDiv.appendChild(completeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Delete";
    actionDiv.appendChild(deleteBtn);

    totalTaskCount.innerText = parseInt(totalTaskCount.innerText) + 1;
    pendingTaskCount.innerText = parseInt(pendingTaskCount.innerText) + 1;

    deleteBtn.onclick = function () {
        moveToDeleted(taskName);
        console.log(taskName);
        li.remove();
        pendingTaskCount.innerText = parseInt(pendingTaskCount.innerText) - 1;
        navigateTo("delete");
    };

    completeBtn.onclick = function () {
        moveToCompleted(taskName);
        li.remove();
        pendingTaskCount.innerText = parseInt(pendingTaskCount.innerText) - 1;
        navigateTo("completed");
    };
}

function moveToCompleted(taskName) {
    let li = document.createElement("li");
    li.innerHTML = "Completed: " + taskName;
    document.getElementById("completed-list").appendChild(li);
    completedTaskCount.innerText = parseInt(completedTaskCount.innerText) + 1;
}

function moveToDeleted(taskName) {
    let li = document.createElement("li");
    li.innerHTML = "Deleted: " + taskName;

    const btnDiv = document.createElement("div");
    btnDiv.className = "undo-btn";
    li.appendChild(btnDiv);

    const removeDiv = document.createElement("div");
    removeDiv.className = "remove-btn";
    li.appendChild(removeDiv);

    let undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    btnDiv.appendChild(undoBtn);

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeDiv.appendChild(removeBtn);

    document.getElementById("deleted-list").appendChild(li);
    deletedTasks[taskName] = li;

    undoBtn.onclick = function () {
        restoreTask(taskName);
        li.remove(); 
    };

    removeBtn.onclick = function (){
        li.remove();
        totalTaskCount.innerText = parseInt(totalTaskCount.innerText) - 1;
    };
}


function restoreTask(taskName) {
    if (deletedTasks[taskName]) {
        deletedTasks[taskName].remove();
        addProgress(taskName);
        delete deletedTasks[taskName];
        navigateTo("progress");
        totalTaskCount.innerText = parseInt(totalTaskCount.innerText) - 1;
    }
}
