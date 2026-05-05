
function TaskCard(props) {
    return (
      <div className="TaskCard card">
        <h3>{props.task.title}</h3>
        <h4>Description:</h4>
        <p>{props.task.description}</p>
      </div>
    );
  }
  
  export default TaskCard;