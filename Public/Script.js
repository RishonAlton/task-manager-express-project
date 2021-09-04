const tasksContainer = document.querySelector(".tasks")
const loading = document.querySelector(".loading")
const alert = document.querySelector(".alert")
const form = document.getElementById("input-container")
const inputField = document.getElementById("input-field")


const displayAlert = (text, action) => {

    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(() => {
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    }, 1000)

}


const showTasks = async () => {

    loading.style.display = "block"

    try {
        const { data: {tasks} } = await axios.get("/api/tasks")
        if(tasks.length === 0) {
            loading.style.display = "none"
            tasksContainer.innerHTML = null
        }
        tasksContainer.innerHTML = tasks.map(task => {
            const { _id, name, completed } = task
            return (`
                <li class="task">
                    <i class="far fa-check-circle ${completed && "show-icon"}"></i>
                    <h4 class="task-name ${completed && "completed"}">${name}</h4>
                    <div class="buttons-container">
                        <a href="./Task.html?id=${_id}" class="edit-button">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button type="submit" class="delete-button" data-id="${_id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </li>
            `)
        }).join(" ")
        loading.style.display = "none"
    } 
    
    catch (error) {
        console.log(error)
        loading.style.display = "none"
    }

}


window.addEventListener("DOMContentLoaded", showTasks)


tasksContainer.addEventListener("click", async (e) => {

    if(e.target.parentElement.classList.contains("delete-button")) {
        loading.style.display = "block"
        const id = e.target.parentElement.dataset.id
        try {
            await axios.delete(`/api/tasks/${id}`)
            await showTasks()
            loading.style.display = "none"
            displayAlert("Task Removed", "success")
        } 
        catch (error) {
            console.log(error)
            loading.style.display = "none"
        }
    }

})


form.addEventListener("submit", async (e) => {

    e.preventDefault()
    const value = inputField.value

    if(!value) {
        displayAlert("Please Enter Value", "danger")
        return
    }

    try {
        await axios.post("/api/tasks", { name: value })
        inputField.value = ""
        await showTasks()
        displayAlert("Task added", "success")
    } 
    
    catch (error) {
        console.log(error)
    }

})