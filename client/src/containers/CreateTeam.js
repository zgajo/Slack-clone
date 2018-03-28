import React, { Component } from "react";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import {
  Header,
  Container,
  Input,
  Button,
  Message,
  Form
} from "semantic-ui-react";

import { changeEmail, changePassword } from "../shared/actions/userActions";

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      nameError: ""
    };
  }

  onSubmit = async () => {
    this.setState({
      nameError: ""
    });

    const response = await this.props.mutate({
      variables: { name: this.state.name }
    });

    const { ok, errors } = response.data.createTeam;

    if (ok) {
      this.props.history.push("/");
    } else {
      this.errorHandler(errors);
    }
  };

  errorHandler(errors) {
    const err = {};
    errors.forEach(({ path, message }) => {
      err[`${path}Error`] = message;
    });

    this.setState({ nameError: err });
  }

  render() {
    let msg = null;

    if (this.state.nameError) {
      const errorList = [];

      errorList.push(this.state.nameError);

      msg = (
        <Message
          error
          header="There was some errors with your login"
          list={errorList}
        />
      );
    }

    return (
      <Container>
        <Header as="h2">Create team</Header>
        <Form>
          <Form.Field error={!!this.state.emailError}>
            <Input
              name="name"
              onChange={e => this.setState({ name: e.target.value })}
              placeholder="Name"
              fluid
              type="text"
            />
          </Form.Field>

          {msg}
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(CreateTeam);
