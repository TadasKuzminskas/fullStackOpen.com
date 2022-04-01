const Header = (props) => {

    return (
      <div>
        <h1>{props.course}</h1>
      </div>
    )
  }
  
  
  const Part = props => {
    return (
      <p>{props.parts.name} {props.parts.exercises}</p>
    )
  }
  
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => 
          <Part key={part.id} parts={part}/>
          )}
    </div>
    )
  }
  
  
  const Total = (props) => {
    const total = props.parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
    return <p><b>total of {total} exercises</b></p>
  }
  
  
  const Course = ({course}) => {
    return (
      <div>
      <Header course={course.name}/>
      <Content parts ={course.parts}/>
      <Total parts={course.parts}/>
    </div>
    )
  }

  export default Course
  