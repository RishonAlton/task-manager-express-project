const form = document.getElementById("form")
const nameInput = document.getElementById("edit-input")
const completedInput = document.getElementById("completed-input")
const editButton = document.querySelector(".edit-task-button")
const taskName = document.getElementById("current-task-name")
const alert = document.querySelector(".alert")

const params = window.location.search
const id = new URLSearchParams(params).get("id")


const displayAlert = (text, action) => {

    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(() => {
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    }, 1000)

}


const showTask = async () => {

    try {
        const { data: {task} } = await axios.get(`/api/tasks/${id}`)
        const { name, completed } = task
        taskName.textContent = name
        if(completed) {
            completedInput.checked = true
        }
    } 
    
    catch (error) {
        console.log(error)
    }

}


window.addEventListener("DOMContentLoaded", showTask)


form.addEventListener("submit", async (e) => {

    e.preventDefault()

    editButton.textContent = "Loading..."

    try {
        let value = nameInput.value
        const checked = completedInput.checked
        if(!value) {
            value = taskName.textContent
        }
        const { data: {task} } = await axios.patch(`/api/tasks/${id}`, { name: value, completed: checked })
        await showTask()
        nameInput.value = ""
        displayAlert("Task edited", "success")
    } 
    
    catch (error) {
        console.log(error)
    }
    
    editButton.textContent = "Edit"

})