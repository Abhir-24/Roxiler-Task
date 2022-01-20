import React,{useEffect,useState,useRef} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

const ToDoList = () => {

    const [todos, setTodos] = useState([]);
    const [state, setState] = useState({selectedUser:undefined, userTodo:[]});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState(null);
    const table = useRef(null);

    useEffect(() => {
       fetch('https://jsonplaceholder.typicode.com/todos').then(res=> res.json()
       .then(data=> {let todo= data.map(item=>{
        item.status=item.completed?'Complete':'Incomplete';
        return item;
    })
        todo.sort((a,b)=>{return a.id-b.id})
         setTodos(todo);
         setLoading(false)
})
       .catch(err=> setError(err.message)))
    }, [])

    const getUser = (user) => {  
        setLoading(true)      
        fetch('http://jsonplaceholder.typicode.com/users/'+user.userId).then(res=> res.json()
       .then(userData=> {
        setState({...state,selectedUser:{...userData,...user}, userTodo:todos.filter(todo=> todo.userId===user.userId)})
        setLoading(false)
       }    )
       .catch(err=> setError(err.message)))
    }

    const header = (
        <div className="table-header">
             todos
            <span className="p-input-icon-left m-l-20">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const userTemplate = () => <div className='w-40 m-50 '>
        <b>User Details</b>
        <Card className=''>
            <div className='row p-b-10'>
                <div className='col-md-5'>
        <b>ToDo ID</b>
                </div>
                <div className='col-md-7'>
        <span>{state.selectedUser.id}</span>
                </div>
            </div>
            <div className='row p-b-10'>
                <div className='col-md-5'>
        <b>ToDo Title</b>
                </div>
                <div className='col-md-7'>
        <span>{state.selectedUser.title}</span>
                </div>
            </div>
            <div className='row p-b-10'>
                <div className='col-md-5'>
        <b>User ID</b>
                </div>
                <div className='col-md-7'>
        <span>{state.selectedUser.userId}</span>
                </div>
            </div>
            <div className='row p-b-10'>
                <div className='col-md-5'>
        <b>Name</b>
                </div>
                <div className='col-md-7'>
        <span>{state.selectedUser.name}</span>
                </div>
            </div>
            <div className='row p-b-10'>
                <div className='col-md-5'>
        <b>Email</b>
                </div>
                <div className='col-md-7'>
        <span>{state.selectedUser.email}</span>
                </div>
            </div>
        </Card>
        <div className='m-t-20'>
        <DataTable  
        value={state.userTodo} 
        paginator rows={5}
        scrollable={true}
        className="p-datatable-customers user-todo-table"
        emptyMessage="No todos found.">

            <Column field="id" header="ToDo ID"  />
            <Column field="title"  header="Title"  />
            <Column field="status" header="Status"  />
        </DataTable>
        </div>
        </div>

  return (
      <>
      {loading && <ProgressSpinner /> }
      {error ? <p>{error}</p> :
         <div className=''>
             <div className='d-flex'>
             <div className='w-50 m-t-20 m-l-20'>
                <DataTable ref={table} value={todos} paginator rows={5}
                scrollable={true}
                    header={header} className="p-datatable-customers"
                    globalFilter={globalFilter} emptyMessage="No todos found.">
                    <Column field="id" header="ToDo ID"  />
                    <Column field="title"  header="Title"  />
                    <Column field="status" header="Status"  />
                    <Column  header="Action" body={(e)=> <Button onClick={()=>getUser(e)}>View User</Button>}  />
                </DataTable>
                </div>
               {state.selectedUser && userTemplate()}
                </div>
            </div>}
            </>
  )
}

export default ToDoList;
