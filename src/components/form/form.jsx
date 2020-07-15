import React from 'react';
import { data } from '../../data/data.js';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.data = data;

    // filter data with conditionals
    this.conditionals = this.data.filter(field => field.conditional !== undefined)

    // initialize state using imported data
    this.state = data
      .reduce((acc, field) => ({ 
        ...acc, 
        [field.name]: { 
          show: true, 
          value: field.type === "checkbox" ? false : "",
          type: field.type, 
        }
      }), {});

    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderCondition = this.renderCondition.bind(this);
  }

  // initial form 
  componentDidMount() {
    this.renderCondition();
  }

  // update the form as input changes
  componentDidUpdate() {
    this.renderCondition();
  }

  // render conditional fields 
  renderCondition() {
    this.conditionals.forEach(field => {
      /* 
        name, type, conditional of the field
        ex) parental_consent
       */
      const { name, conditional } = field;

      /*
        conditional value and type
        ex) conditional.name => date_of_birth 
        ex) conditional.type => date
       */
      let value = this.state[conditional.name].value;
      const type = this.state[conditional.name].type;

      // conditional switch depending on the type
      switch (type) {
        case "date":
          value = new Date(value);
          break;
        default:
      }

      // current state
      const state = this.state[name];

      // conditional state using the current value
      const condition = conditional.show_if(value);

      // compare and update if different
      if (state.show !== condition) {
        state.show = condition;
        this.setState({ [name]: state });
      }
    })
  }


  // update field state
  update(field, type) {

    return (e) => {
      let state = this.state[field];

      switch (type) {
        case "checkbox":
          state.value = event.target.checked;
          break;
        default:
          state.value = event.target.value;
      }
      this.setState({ [field]: state })
    }
  }

  // Create the output JS object upon form submission
  handleSubmit(e) {
    e.preventDefault();

    /*
      iterate and construct output object
      if set to show and is not blank
     */
    this.output = {};
    for (const field in this.state) {
      const currField = this.state[field];
      if (currField.show && currField.value !== "") {
        this.output[field] = this.state[field].value;
      }
    }

    /* 
      this.output is the output JS object
      console log so it can be viewed in the console
     */
    console.log(this.output);

    // render output
    this.setState({ state: this.state });
  }

  render() {
    return (
      <div className="container">
        <div></div>
        <div className="center">
          <form>
            {
              this.data.map((field) => {
                if (this.state[field.name].show === true) {
                  return (
                    <div key={field.name} className={field.name}>
                      <label htmlFor={field.name}>{field.human_label}</label>
                      <input 
                        type={field.type} 
                        name={field.name}
                        onChange={this.update(`${field.name}`, `${field.type}`)}
                      />
                    </div>
                  )
                }
              })
            }
            <button onClick={this.handleSubmit}>
              Submit
            </button>
          </form>

          {/*
              render visual representation of the ouput JS Object      
            */}
          <div className="output">
            <div>{`{`}</div>
            {
              this.output ? Object.keys(this.output).map((field, key) => {
                return (
                  <div key={key} className="field">
                  {`"${field}": `}
                  {this.state[field].type === "checkbox" ? "" : '"'}
                  {`${this.output[field]}`}
                  {this.state[field].type === "checkbox" ? "" : '"'}
                  {key === Object.keys(this.output).length - 1 ? "" : ","}
                  </div>
                )
              }) : ""
            }     
            <div>{`}`}</div>
          </div>
        </div>
        <div></div>
      </div>
    )
  }
}

export default Form;