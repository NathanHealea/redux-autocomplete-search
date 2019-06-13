import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, List, ListItem, ListItemText } from '@material-ui/core';

const mapStateToProps = (state, ownProps) => {
  return {
    error: state.cards.error,
    list: state.cards.items,
    loading: state.cards.loading
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const styles = theme => ({});

class Results extends Component {
  render() {
    const { classes, list, error, loading } = this.props;

    if (error) {
      return (
        <div>
          <p>Error</p>
          <p>{JSON.stringify(error)}</p>
        </div>
      );
    }

    if (loading) {
      return <p>Loading..</p>;
    }

    return (
      <List>
        {list.map(card => {
          return (
            <ListItem key={card.id}>
              <ListItemText
                primary={`${card.name} - ${card.type_line}`}
                secondary={`${card.rarity} - ${card.set_name}`}
              />
            </ListItem>
          );

          // return <img src={card.image_uris.small} />
        })}
      </List>
    );
  }
}

const StatefulResults = connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);

export default withStyles(styles)(StatefulResults);
