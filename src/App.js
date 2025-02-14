import logo from './logo.svg'
import './App.css'
import { useEffect, useState } from 'react'
import React from 'react'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { FaRegCircleCheck } from 'react-icons/fa6'

function App() {
    const [isCompleteScreen, setIsCompleteScreen] = useState(false)
    const [allTodos, setTodos] = useState([]) // 할 일 목록
    const [newTitle, setNewTitle] = useState('') // 새 할 일 제목
    const [newDescription, setNewDiscription] = useState('') // 새 할 일 설명

    const [completedTodos, setCompletedTodos] = useState([]) // 완료된 할 일

    const [currentEdit, setCurrentEdit] = useState('') // 수정중인 항목의 인덱스 저장
    const [currentedEditedItem, setCurrentEditedItem] = useState('') // 수정중인 항목의 데이터 저장

    // 새로운 할 일 추가
    const handleAddTodo = () => {
        let newTodoItem = {
            title: newTitle,
            description: newDescription,
        }

        let updatedTodoArr = [...allTodos]
        updatedTodoArr.push(newTodoItem)
        setTodos(updatedTodoArr)

        localStorage.setItem('todolist', JSON.stringify(updatedTodoArr))
    }

    // 할 일 삭제
    const handleDeleteTodo = index => {
        let reducedTodo = [...allTodos]
        reducedTodo.splice(index, 1)

        localStorage.setItem('todolist', JSON.stringify(reducedTodo))
        setTodos(reducedTodo)
    }

    // 완료된 할 일
    const handleComplete = index => {
        let now = new Date()
        let dd = now.getDate()
        let mm = now.getMonth() + 1
        let yyyy = now.getFullYear()
        let h = now.getHours()
        let m = now.getMinutes()
        let s = now.getSeconds()

        // 현재 날짜와 시간
        let completedOn =
            dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s

        // 완료된 할 일 항목 객체 생성
        let filteredItem = {
            ...allTodos[index],
            completedOn: completedOn,
        }

        // 완료된 항목을 목록에 추가
        let updatedCompletedArr = [...completedTodos]
        updatedCompletedArr.push(filteredItem)
        setCompletedTodos(updatedCompletedArr)
        handleDeleteTodo(index)
        localStorage.setItem(
            'completedTodos',
            JSON.stringify(updatedCompletedArr)
        )
    }

    // 완료된 할 일 삭제
    const handleDeleteCompletedTodo = index => {
        let reducedTodo = [...completedTodos]
        reducedTodo.splice(index, 1)

        localStorage.setItem('completedTodos', JSON.stringify(reducedTodo))
        setCompletedTodos(reducedTodo)
    }

    useEffect(() => {
        let savedTodo = JSON.parse(localStorage.getItem('todolist'))
        let savedCompletedTodo = JSON.parse(
            localStorage.getItem('completedTodos')
        )
        let savedUpdatedTodo = JSON.parse(localStorage.getItem('todolist'))

        if (savedTodo) {
            setTodos(savedTodo)
        }
        if (savedCompletedTodo) {
            setCompletedTodos(savedCompletedTodo)
        }
        if (savedUpdatedTodo) {
            setCurrentEditedItem(savedUpdatedTodo)
        }
    }, [])

    // 할 일 수정
    const handleEdit = (idx, item) => {
        setCurrentEdit(idx) // 현재 클릭한 항목의 인덱스를 저장
        setCurrentEditedItem(item) // 현재 클릭된 항목의 데이터를 저장
    }

    const handleUpdateTitle = value => {
        setCurrentEditedItem(prev => {
            return { ...prev, title: value }
        })
    }
    const handleUpdateDescription = value => {
        setCurrentEditedItem(prev => {
            return { ...prev, description: value }
        })
    }

    const handleUpdateToDo = () => {
        let newTodo = [...allTodos]
        newTodo[currentEdit] = currentedEditedItem
        setTodos(newTodo)
        setCurrentEdit('')
        localStorage.setItem('todolist', JSON.stringify(newTodo))
    }

    return (
        <div className="App">
            <h1>My Todos</h1>
            <div className="todo-wrapper">
                <div className="todo-input">
                    <div className="todo-input-item">
                        <label>Title</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="What's the title of your To Do?"
                        />
                    </div>
                    <div className="todo-input-item">
                        <label>Description</label>
                        <input
                            type="text"
                            value={newDescription}
                            onChange={e => setNewDiscription(e.target.value)}
                            placeholder="What's the description of your To Do?"
                        />
                    </div>
                    <div className="todo-input-item">
                        <button
                            type="button"
                            onClick={handleAddTodo}
                            className="primaryBtn"
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div className="btn-area">
                    <button
                        className={`secondaryBtn ${
                            isCompleteScreen === false && 'active'
                        }`}
                        onClick={() => setIsCompleteScreen(false)}
                    >
                        Todo
                    </button>

                    <button
                        className={`secondaryBtn ${
                            isCompleteScreen === true && 'active'
                        }`}
                        onClick={() => setIsCompleteScreen(true)}
                    >
                        Complete
                    </button>
                </div>

                <div className="todo-list">
                    {isCompleteScreen == false &&
                        allTodos.map((item, index) => {
                            if (currentEdit === index) {
                                return (
                                    <div className="edit_wrapper" key={index}>
                                        <input
                                            type="text"
                                            placeholder="Updated Title"
                                            onChange={e =>
                                                handleUpdateTitle(
                                                    e.target.value
                                                )
                                            }
                                            value={currentedEditedItem.title}
                                        />
                                        <textarea
                                            placeholder="Updated Description"
                                            rows={4}
                                            onChange={e =>
                                                handleUpdateDescription(
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                currentedEditedItem.description
                                            }
                                        ></textarea>
                                        <button
                                            type="button"
                                            onClick={handleUpdateToDo}
                                            className="primaryBtn"
                                        >
                                            Update
                                        </button>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="todo-list-item" key={index}>
                                        <div>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </div>

                                        <div>
                                            <AiOutlineDelete
                                                className="icon"
                                                title="Deleate?"
                                                onClick={() =>
                                                    handleDeleteTodo(index)
                                                }
                                            />
                                            <FaRegCircleCheck
                                                className="check-icon"
                                                title="Complete"
                                                onClick={() =>
                                                    handleComplete(index)
                                                }
                                            />
                                            <AiOutlineEdit
                                                className="check-icon"
                                                title="Edit?"
                                                onClick={() =>
                                                    handleEdit(index, item)
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    {isCompleteScreen == true &&
                        completedTodos.map((item, index) => {
                            return (
                                <div className="todo-list-item" key={index}>
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                        <p>
                                            <samll>
                                                Completed on:{item.completedOn}
                                            </samll>
                                        </p>
                                    </div>

                                    <div>
                                        <AiOutlineDelete
                                            className="icon"
                                            title="Deleate?"
                                            onClick={() =>
                                                handleDeleteCompletedTodo(index)
                                            }
                                        />
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default App
