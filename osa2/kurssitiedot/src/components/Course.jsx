const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    );
  };
  
  const Header = (props) => {
    return (
      <div>
        <h1>{props.course}</h1>
      </div>
    );
  };
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        ))} 
      </div>
    );
  };
  
  const Total = ({parts}) => {
    const totalExercises = parts.reduce((s, p) => s +p.exercises, 0)
    return (
      <div>
        <b>
        Total of {totalExercises} exercises
        </b>
      </div>
    );
  };
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part} {props.exercises}
        </p>
      </div>
    );
  };

  export default Course